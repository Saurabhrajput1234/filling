import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, email, password, name, role } = body;

  if (!action || !email || !password) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (action === 'register') {
    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }
    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: name || '',
        role: role || 'SEEKER',
      },
    });
    return NextResponse.json({ message: 'User registered', user: { id: user.id, email: user.email, name: user.name, role: user.role } }, { status: 201 });
  }

  if (action === 'login') {
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    // Check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    // Create JWT
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return NextResponse.json({ message: 'Login successful', token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
} 