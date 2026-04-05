import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

// --- كود إعداد الإشعارات للأبلكيشن ---
const setupPushNotifications = async () => {
  // نتحقق أولاً إذا كان المستخدم يفتح من التطبيق وليس من المتصفح
  if (Capacitor.isNativePlatform()) {
    try {
      // 1. التحقق من الصلاحيات
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.warn("User denied push permissions");
        return;
      }

      // 2. تسجيل الجهاز في خدمات Firebase للحصول على الـ Token
      await PushNotifications.register();

      // 3. مستمع (Listener) عند نجاح التسجيل (اختياري للـ Debugging)
      PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success, token: ' + token.value);
      });

      // 4. مستمع للأخطاء
      PushNotifications.addListener('registrationError', (error) => {
        console.error('Error on registration: ' + JSON.stringify(error));
      });

    } catch (e) {
      console.error("Push Notification Setup Error", e);
    }
  }
};

// تشغيل دالة الإشعارات
setupPushNotifications();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)