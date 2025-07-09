import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const resumes = await prisma.resume.findMany();
    return NextResponse.json(resumes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch resumes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const resume = await prisma.resume.create({ data });
    return NextResponse.json(resume, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create resume' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const resume = await prisma.resume.update({
      where: { id: data.id },
      data,
    });
    return NextResponse.json(resume);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update resume' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.resume.delete({ where: { id } });
    return NextResponse.json({ message: 'Resume deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete resume' }, { status: 500 });
  }
} 