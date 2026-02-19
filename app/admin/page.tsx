'use client';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

// إعداد عميل Supabase باستخدام بياناتك
const supabase = createClient(
  'https://xtclacofbmsvzjtwcbcg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Y2xhY29mYm1zdnpqdHdjYmNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NTE1OTEsImV4cCI6MjA4NzAyNzU5MX0.cJNhq1w4U7FEkIggE9hXatr7sEu1fQkQpO3lEQn1gr4'
);

export default function AdminPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // دالة جلب البيانات من الداتابيز
  async function fetchMessages() {
    setLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching:', error);
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  // دالة لحذف رسالة معينة
  async function deleteMessage(id: number) {
    if (confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
      const { error } = await supabase.from('messages').delete().eq('id', id);
      if (error) alert('فشل الحذف');
      else fetchMessages(); // تحديث القائمة بعد الحذف
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-10" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">لوحة التحكم 🔐</h1>
            <p className="text-gray-500 mt-1">إدارة الرسائل السرية المستلمة</p>
          </div>
          <div className="bg-blue-50 px-6 py-3 rounded-2xl text-center border border-blue-100">
            <span className="block text-2xl font-black text-blue-600">{messages.length}</span>
            <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">إجمالي الرسائل</span>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 text-lg font-medium">لا توجد رسائل في الصندوق حالياً.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group">
                {/* محتوى الرسالة */}
                <p className="text-xl text-gray-800 mb-6 leading-relaxed">"{msg.content}"</p>
                
                {/* بيانات المرسل */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm">
                  <div className="flex items-center text-gray-600">
                    <span className="ml-2">🕒</span>
                    <span><strong>التاريخ:</strong> {new Date(msg.created_at).toLocaleString('ar-EG')}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="ml-2">📍</span>
                    <span><strong>الموقع:</strong> {msg.location || 'غير معروف'}</span>
                  </div>
                  <div className="flex items-center text-gray-600 md:col-span-2">
                    <span className="ml-2">💻</span>
                    <span className="truncate"><strong>الجهاز:</strong> {msg.device}</span>
                  </div>
                </div>

                {/* زر الحذف يظهر عند الوقوف على الرسالة */}
                <button 
                  onClick={() => deleteMessage(msg.id)}
                  className="absolute top-4 left-4 bg-red-50 text-red-500 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition hover:bg-red-500 hover:text-white"
                  title="حذف الرسالة"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}