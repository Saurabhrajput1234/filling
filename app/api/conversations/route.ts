import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const conversations = await prisma.conversation.findMany({
      include: {
        user: true,
        company: true,
        messages: true,
      },
    });
    return NextResponse.json(conversations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const conversation = await prisma.conversation.create({
      data: {
        userId: data.userId,
        companyId: data.companyId,
      },
    });
    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const conversation = await prisma.conversation.update({
      where: { id: data.id },
      data: {
        userId: data.userId,
        companyId: data.companyId,
      },
    });
    return NextResponse.json(conversation);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update conversation' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.conversation.delete({ where: { id } });
    return NextResponse.json({ message: 'Conversation deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 });
  }
} 