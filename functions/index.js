const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const admin = require("firebase-admin");
const crypto = require("crypto");

admin.initializeApp();

// تحديد المنطقة لضمان السرعة مع الداتابيز تبعتك (eur3)
setGlobalOptions({ region: "europe-west3" });

const studentsCollection = (appId) => admin.firestore()
  .collection('artifacts').doc(appId).collection('public').doc('data').collection('students');
const sha256 = value => crypto.createHash('sha256').update(String(value)).digest('hex');
const passwordMatches = (stored, supplied) => {
  const left = Buffer.from(String(stored || ''));
  const plain = Buffer.from(String(supplied || ''));
  const hashed = Buffer.from(sha256(supplied || ''));
  return (left.length === plain.length && crypto.timingSafeEqual(left, plain)) ||
    (left.length === hashed.length && crypto.timingSafeEqual(left, hashed));
};

// Migrates a legacy family on its first successful login. No legacy fields are
// removed here, so the migration is reversible while accounts are rolled out.
exports.familyLogin = onCall(async request => {
  const username = String(request.data?.username || '').trim().toLowerCase();
  const password = String(request.data?.password || '');
  if (!username || !password || username.length > 100 || password.length > 200) {
    throw new HttpsError('invalid-argument', 'بيانات الدخول غير صحيحة');
  }

  const appId = 'brave-academy-live-data';
  const studentsRef = studentsCollection(appId);
  const candidates = await studentsRef.where('username', '==', username).limit(20).get();
  const matched = candidates.docs.find(item => passwordMatches(item.data().password, password));
  if (!matched) throw new HttpsError('unauthenticated', 'بيانات الدخول غير صحيحة');

  const student = matched.data();
  const familyId = student.familyId ?? matched.id;
  const familySnap = student.familyId == null
    ? { docs: [matched] }
    : await studentsRef.where('familyId', '==', familyId).get();
  const existingUid = familySnap.docs.map(item => item.data().familyUid).find(Boolean);
  const internalEmail = `family.${sha256(String(familyId)).slice(0, 24)}@brave.internal`;

  let authUser;
  if (existingUid) {
    try { authUser = await admin.auth().getUser(existingUid); } catch (_) {}
  }
  if (!authUser) {
    try { authUser = await admin.auth().getUserByEmail(internalEmail); } catch (_) {}
  }
  const authPassword = password.length >= 6 ? password : crypto.randomBytes(24).toString('base64url');
  if (!authUser) {
    authUser = await admin.auth().createUser({ email: internalEmail, password: authPassword, displayName: student.familyName || student.name });
  } else if (password.length >= 6) {
    await admin.auth().updateUser(authUser.uid, { password, displayName: student.familyName || student.name });
  }
  await admin.auth().setCustomUserClaims(authUser.uid, { role: 'family', familyId: String(familyId) });

  const batch = admin.firestore().batch();
  familySnap.docs.forEach(item => batch.set(item.ref, {
    familyUid: authUser.uid,
    familyAuthEmail: internalEmail,
    authMigratedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true }));
  await batch.commit();

  if (password.length >= 6) return { email: internalEmail };
  return { customToken: await admin.auth().createCustomToken(authUser.uid) };
});

exports.updateFamilyCredentials = onCall(async request => {
  if (!request.auth || request.auth.token.role !== 'family') {
    throw new HttpsError('unauthenticated', 'يجب تسجيل الدخول كعائلة');
  }
  const username = String(request.data?.username || '').trim().toLowerCase();
  const password = String(request.data?.password || '');
  if (!/^[a-z0-9._-]{3,50}$/.test(username) || password.length < 6 || password.length > 200) {
    throw new HttpsError('invalid-argument', 'اسم المستخدم أو كلمة المرور غير صالحين');
  }

  const appId = 'brave-academy-live-data';
  const studentsRef = studentsCollection(appId);
  const duplicate = await studentsRef.where('username', '==', username).limit(20).get();
  if (duplicate.docs.some(item => item.data().familyUid !== request.auth.uid)) {
    throw new HttpsError('already-exists', 'اسم المستخدم مستخدم مسبقًا');
  }
  const familySnap = await studentsRef.where('familyUid', '==', request.auth.uid).get();
  if (familySnap.empty) throw new HttpsError('not-found', 'لم يتم العثور على العائلة');

  await admin.auth().updateUser(request.auth.uid, { password });
  const hashed = sha256(password);
  const batch = admin.firestore().batch();
  familySnap.docs.forEach(item => batch.set(item.ref, {
    username,
    password: hashed,
    isPasswordHashed: true,
    credentialsUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true }));
  await batch.commit();
  return { ok: true };
});

exports.adminResetFamilyPassword = onCall(async request => {
  if (!request.auth?.token?.email) throw new HttpsError('unauthenticated', 'يجب تسجيل دخول الإدارة');
  const appId = 'brave-academy-live-data';
  const email = String(request.auth.token.email).toLowerCase();
  const profile = await admin.firestore().doc(`artifacts/${appId}/public/data/users/${email}`).get();
  const isSuper = ['admin@brave.com', 'jehad234kawash@yahoo.com'].includes(email) || profile.data()?.isSuper === true;
  const allowed = isSuper || (profile.exists && (profile.data().permissions || []).includes('password_resets'));
  if (!allowed) throw new HttpsError('permission-denied', 'لا توجد صلاحية لإعادة التعيين');

  const studentId = String(request.data?.studentId || '');
  const requestId = String(request.data?.requestId || '');
  const password = String(request.data?.password || '');
  if (!studentId || !requestId || password.length < 6 || password.length > 200) {
    throw new HttpsError('invalid-argument', 'بيانات إعادة التعيين غير صالحة');
  }
  const studentRef = studentsCollection(appId).doc(studentId);
  const studentSnap = await studentRef.get();
  if (!studentSnap.exists) throw new HttpsError('not-found', 'الطالب غير موجود');
  const student = studentSnap.data();
  const familySnap = student.familyUid
    ? await studentsCollection(appId).where('familyUid', '==', student.familyUid).get()
    : student.familyId != null
      ? await studentsCollection(appId).where('familyId', '==', student.familyId).get()
      : { docs: [studentSnap] };

  if (student.familyUid) await admin.auth().updateUser(student.familyUid, { password });
  const batch = admin.firestore().batch();
  const hashed = sha256(password);
  familySnap.docs.forEach(item => batch.set(item.ref, {
    password: hashed,
    isPasswordHashed: true,
    passwordResetAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true }));
  batch.set(admin.firestore().doc(`artifacts/${appId}/public/data/password_reset_requests/${requestId}`), {
    status: 'completed',
    matchedStudentId: studentId,
    handledAt: admin.firestore.FieldValue.serverTimestamp(),
    handledBy: email,
  }, { merge: true });
  await batch.commit();
  return { ok: true };
});

exports.sendAttendanceNotification = onDocumentUpdated(
  "artifacts/{appId}/public/data/students/{studentId}",
  async (event) => {
    // التأكد من وجود بيانات قبل وبعد التعديل
    if (!event.data) return null;

    const newData = event.data.after.data();
    const oldData = event.data.before.data();

    // الحصول على تاريخ اليوم بتوقيت الأردن (YYYY-MM-DD)
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Amman' });

    // التحقق: هل قام الكابتن بتفعيل الحضور اليوم الآن؟
    const isMarkedPresentNow = newData.attendance?.[today] === true;
    const wasAlreadyPresent = oldData.attendance?.[today] === true;

    if (isMarkedPresentNow && !wasAlreadyPresent) {
      // Keep supporting the old single token while also notifying every device
      // registered for this student.
      const tokenSnapshot = await admin.firestore()
        .collection(`artifacts/${event.params.appId}/public/data/device_tokens`)
        .where('studentId', '==', event.params.studentId)
        .get();
      const tokenDocs = new Map(tokenSnapshot.docs.map(doc => [doc.data().token, doc]));
      if (newData.fcmToken && !tokenDocs.has(newData.fcmToken)) tokenDocs.set(newData.fcmToken, null);
      const tokens = [...tokenDocs.keys()].filter(Boolean).slice(0, 500);

      if (tokens.length) {
        const message = {
          notification: {
            title: "بطل التايكواندو وصل! 🥋",
            body: `ولي الأمر المحترم، نود إعلامكم بوصول البطل (${newData.name}) للأكاديمية وبدء الحصة التدريبية.`,
          },
          android: {
            priority: "high", // مهم جداً لظهور النص من فوق
            notification: {
              channelId: "attendance_notifications", // قناة الإشعارات
              sound: "default",
              priority: "high",
              visibility: "public",
            },
          },
          tokens,
        };

        try {
          const response = await admin.messaging().sendEachForMulticast(message);
          console.log(`تم إرسال ${response.successCount} إشعار، وفشل ${response.failureCount}`);
          const invalidCodes = new Set([
            'messaging/invalid-registration-token',
            'messaging/registration-token-not-registered',
          ]);
          const cleanup = [];
          response.responses.forEach((result, index) => {
            if (!result.success && invalidCodes.has(result.error?.code)) {
              const tokenDoc = tokenDocs.get(tokens[index]);
              if (tokenDoc) cleanup.push(tokenDoc.ref.delete());
            }
          });
          await Promise.all(cleanup);
        } catch (error) {
          console.error("خطأ في إرسال الإشعار:", error);
        }
      } else {
        console.log("الطالب ليس لديه أجهزة إشعارات مسجلة");
      }
    }
    return null;
  }
);
