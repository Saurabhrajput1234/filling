import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, password, name, role } = body;

    if (!action || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (action === 'register') {
      try {
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
        
        // Create JWT token for registration
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        
        return NextResponse.json({ 
          message: 'User registered', 
          token,
          user: { id: user.id, email: user.email, name: user.name, role: user.role } 
        }, { status: 201 });
      } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
      }
    }

    if (action === 'login') {
      try {
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
      } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 