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
      // إذا وجدنا عنوان الجهاز (Token)
      if (newData.fcmToken) {
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
          token: newData.fcmToken,
        };

        try {
          const response = await admin.messaging().send(message);
          console.log("تم إرسال الإشعار بنجاح:", response);
        } catch (error) {
          console.error("خطأ في إرسال الإشعار:", error);
        }
      } else {
        console.log("الطالب ليس لديه توكن مسجل");
      }
    }
    return null;
  }
);