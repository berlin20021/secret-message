'use client';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchMessages() {
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    setMessages(data || []);
    setLoading(false);
  }

  useEffect(() => { fetchMessages(); }, []);

  if (loading) return <div className="p-20 text-center font-bold">جاري تحميل السجلات...</div>;

  return (
    <main className="min-h-screen bg-gray-100 p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-black mb-8 text-gray-800 text-center">الرسايل المستلمة (الخزنة 🔐)</h1>
        
        <div className="space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
              <p className="text-lg text-gray-700 font-medium mb-6 leading-relaxed">"{msg.content}"</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-500">
                <p><strong>🕒 تاريخ الإرسال:</strong> {new Date(msg.created_at).toLocaleString('ar-EG')}</p>
                
                <p>
                  <strong>📍 سجل التتبع:</strong> 
                  {msg.location.includes('http') ? (
                    <a href={msg.location} target="_blank" className="text-blue-500 underline mr-1 hover:text-blue-700">
                       [ فتح الخريطة الجغرافية ]
                    </a>
                  ) : (
                    <span className="text-red-400 mr-1">{msg.location}</span>
                  )}
                </p>
                
                <p className="md:col-span-2 truncate font-mono">
                  <strong>🖥️ بصمة الجهاز:</strong> {msg.device}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}