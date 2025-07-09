import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const companies = await prisma.company.findMany();
    return NextResponse.json(companies);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const company = await prisma.company.create({ data });
    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const company = await prisma.company.update({
      where: { id: data.id },
      data,
    });
    return NextResponse.json(company);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.company.delete({ where: { id } });
    return NextResponse.json({ message: 'Company deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete company' }, { status: 500 });
  }
} 