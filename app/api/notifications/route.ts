import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const notifications = await prisma.notification.findMany();
    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const notification = await prisma.notification.create({ data });
    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const notification = await prisma.notification.update({
      where: { id: data.id },
      data,
    });
    return NextResponse.json(notification);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.notification.delete({ where: { id } });
    return NextResponse.json({ message: 'Notification deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
  }
} 