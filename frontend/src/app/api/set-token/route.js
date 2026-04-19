import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { token } = await request.json();
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'token',
    value: token,
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });
  return NextResponse.json({ success: true });
}
