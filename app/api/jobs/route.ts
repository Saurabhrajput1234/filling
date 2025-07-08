import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Handle fetching jobs
  return NextResponse.json({ message: 'Jobs endpoint placeholder' });
} 