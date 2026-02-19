'use client';
import { createClient } from '@supabase/supabase-js';
import { useState, FormEvent } from 'react';

const supabase = createClient(
  'https://xtclacofbmsvzjtwcbcg.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Y2xhY29mYm1zdnpqdHdjYmNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NTE1OTEsImV4cCI6MjA4NzAyNzU5MX0.cJNhq1w4U7FEkIggE9hXatr7sEu1fQkQpO3lEQn1gr4'
);

export default function Home() {
  const [message, setMessage] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('جاري طلب إذن الموقع وإرسال الرسالة...');

    // دالة لجلب الإحداثيات (GPS) بدقة
    const getExactLocation = (): Promise<string> => {
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          resolve("المتصفح لا يدعم تحديد الموقع");
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            // بيحول الإحداثيات لرابط خريطة جاهز
            const { latitude, longitude } = pos.coords;
            resolve(`https://www.google.com/maps?q=${latitude},${longitude}`);
          },
          (err) => {
            resolve("رفض المستخدم مشاركة الموقع");
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      });
    };

    const locationResult = await getExactLocation();

    // إرسال البيانات لجدول messages في Supabase
    const { error } = await supabase
      .from('messages')
      .insert([{ 
        content: message, 
        device: typeof window !== 'undefined' ? navigator.userAgent : 'Unknown Device',
        location: locationResult 
      }]);

    if (error) {
      setStatus('حدث خطأ أثناء الإرسال');
    } else {
      setStatus('تم إرسال رسالتك بنجاح! شكراً لصراحتك.');
      setMessage('');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4" dir="rtl">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">صندوق الرسائل السري</h1>
        <p className="text-gray-500 mb-8 text-sm">اكتب رسالتك وسيتم إرفاق موقعك بدقة (يرجى السماح بالوصول للموقع)</p>
        
        <form onSubmit={sendMessage}>
          <textarea
            className="w-full p-4 border border-gray-200 rounded-2xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right bg-gray-50"
            rows={5}
            placeholder="اكتب رسالتك الصريحة هنا..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-100"
          >
            إرسال بـسـريـة
          </button>
        </form>
        
        {status && (
          <p className={`mt-6 text-sm font-bold ${status.includes('نجاح') ? 'text-green-600' : 'text-blue-500'}`}>
            {status}
          </p>
        )}
      </div>
    </main>
  );
}