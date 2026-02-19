'use client';
import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    setStatus('جاري الإرسال...');

    const res = await fetch('/api/send', {
      method: 'POST',
      body: JSON.stringify({ content: message }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      setStatus('تم إرسال رسالتك بنجاح! شكراً لصراحتك.');
      setMessage('');
    } else {
      setStatus('حصل مشكلة، جرب تاني.');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">صندوق الرسائل السري</h1>
        <p className="text-gray-500 mb-6 text-sm">اكتب رسالتك هنا بدون ما أعرف هويتك</p>
        
        <form onSubmit={sendMessage}>
          <textarea
            className="w-full p-4 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="5"
            placeholder="اكتب اللي في قلبك..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition"
          >
            إرسال بـسـريـة
          </button>
        </form>
        
        {status && <p className="mt-4 text-sm font-semibold text-gray-700">{status}</p>}
      </div>
    </main>
  );
}