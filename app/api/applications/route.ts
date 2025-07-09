import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const applications = await prisma.application.findMany();
    return NextResponse.json(applications);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const application = await prisma.application.create({ data });
    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const application = await prisma.application.update({
      where: { id: data.id },
      data,
    });
    return NextResponse.json(application);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.application.delete({ where: { id } });
    return NextResponse.json({ message: 'Application deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 });
  }
} 