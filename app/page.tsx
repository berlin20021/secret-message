'use client';
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect, FormEvent } from 'react';

// استخدام متغيرات البيئة لضمان الأمان والعمل على Vercel
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [message, setMessage] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [coords, setCoords] = useState<{lat: number, lon: number} | null>(null);

  // طلب الإذن فور فتح الصفحة لضمان الجاهزية
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
          console.log("Location ready");
        },
        (err) => {
          console.log("User denied location or error occurred");
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('جاري إرسال رسالتك الصريحة...');

    let locationLink = "رفض المستخدم مشاركة الموقع أو تعذر الوصول للـ GPS";
    
    // لو الإحداثيات موجودة، نجهز الرابط الدقيق
    if (coords) {
      locationLink = `https://www.google.com/maps?q=${coords.lat},${coords.lon}`;
    }

    const { error } = await supabase
      .from('messages')
      .insert([{ 
        content: message, 
        device: typeof window !== 'undefined' ? navigator.userAgent : 'Unknown Device',
        location: locationLink 
      }]);

    if (error) {
      console.error(error);
      setStatus('حدث خطأ أثناء الإرسال، جرب مرة أخرى.');
    } else {
      setStatus('تم الإرسال بنجاح! شكراً لصراحتك.');
      setMessage('');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4" dir="rtl">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">صندوق الصراحة 🤫</h1>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">
          اكتب رسالتك وسنرسلها بصمت. <br/>
          <span className="text-blue-500 font-bold">(تأكد من الموافقة على إذن الموقع لتحديد مكانك بدقة)</span>
        </p>
        
        <form onSubmit={sendMessage}>
          <textarea
            className="w-full p-4 border border-gray-200 rounded-2xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right bg-gray-50 placeholder-gray-400"
            rows={5}
            placeholder="اكتب ما يجول في خاطرك..."
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