import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Handle fetching user profile
  return NextResponse.json({ message: 'User endpoint placeholder' });
} 