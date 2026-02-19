import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

export const dynamic = 'force-dynamic'; 

export default async function AdminDashboard() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="min-h-screen bg-gray-50 p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 border-b pb-4">الرسائل المستلمة</h1>
        <div className="grid gap-6">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white p-6 rounded-2xl shadow-sm border">
              <p className="text-xl mb-4">"{msg.content}"</p>
              <div className="text-xs text-gray-500 grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-lg">
                <p><strong>الوقت:</strong> {new Date(msg.createdAt).toLocaleString('ar-EG')}</p>
                <p><strong>الجهاز:</strong> {msg.device}</p>
                <p><strong>الموقع:</strong> {msg.city}, {msg.country}</p>
                <p><strong>IP:</strong> {msg.ip}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}