const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { setGlobalOptions } = require("firebase-functions/v2");
const admin = require("firebase-admin");

admin.initializeApp();

// تحديد المنطقة لضمان السرعة مع الداتابيز تبعتك (eur3)
setGlobalOptions({ region: "europe-west3" });

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
