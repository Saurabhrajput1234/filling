import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const jobs = await prisma.job.findMany();
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const job = await prisma.job.create({ data });
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const job = await prisma.job.update({
      where: { id: data.id },
      data,
    });
    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.job.delete({ where: { id } });
    return NextResponse.json({ message: 'Job deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
} 