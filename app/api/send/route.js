import { NextResponse } from 'next/server';
import { UAParser } from 'ua-parser-js';
import { PrismaClient } from '@prisma/client';

// تمرير الـ URL يدوياً للـ Client في الإصدار الجديد
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: 'الرسالة فارغة' }, { status: 400 });
    }

    const headers = request.headers;
    const ip = headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgentString = headers.get('user-agent') || '';
    
    const parser = new UAParser(userAgentString);
    const result = parser.getResult();

    const device = result.os.name ? `${result.os.name} ${result.os.version || ''}` : 'Unknown OS';
    const browser = result.browser.name ? `${result.browser.name} ${result.browser.version || ''}` : 'Unknown Browser';

    // بيانات الموقع من Vercel عند الرفع
    const city = headers.get('x-vercel-ip-city') || 'Local';
    const country = headers.get('x-vercel-ip-country') || 'Local';

    const newMessage = await prisma.message.create({
      data: {
        content,
        ip,
        device,
        browser,
        city,
        country,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: 'Database Connection Error' }, { status: 500 });
  }
}