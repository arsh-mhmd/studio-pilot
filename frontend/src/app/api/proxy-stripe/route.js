import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return NextResponse.json({detail: 'Unauthorized'}, {status: 401});
  
  const res = await fetch('http://127.0.0.1:8000/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await res.json();
  return NextResponse.json(data, {status: res.status});
}
