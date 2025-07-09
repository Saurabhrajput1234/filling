import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const messages = await prisma.message.findMany();
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const message = await prisma.message.create({ data });
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const message = await prisma.message.update({
      where: { id: data.id },
      data,
    });
    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.message.delete({ where: { id } });
    return NextResponse.json({ message: 'Message deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
} 