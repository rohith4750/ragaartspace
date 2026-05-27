import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendPasswordResetEmail } from '@/lib/mail';

const SECRET = process.env.NEXTAUTH_SECRET || 'default_secret';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || user.role !== 'ADMIN') {
      // Do not reveal existence for security
      return NextResponse.json({ message: 'If the admin email exists, a reset link will be sent.' });
    }
    const token = jwt.sign({ email: user.email }, SECRET, { expiresIn: '24h' });
    // Send email
    await sendPasswordResetEmail(user.email, token);
    return NextResponse.json({ message: 'If the admin email exists, a reset link will be sent.' });
  } catch (error) {
    console.error('Forgot password error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
