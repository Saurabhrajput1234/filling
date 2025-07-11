import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });
    return NextResponse.json(companies);
  } catch (error) {
    console.error('GET /api/companies error:', error);
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('POST /api/companies - Starting company creation...');
    
    const data = await req.json();
    console.log('POST /api/companies - Received data:', JSON.stringify(data, null, 2));
    
    // Check if this is a request to create company for existing user
    if (data.userId) {
      console.log('POST /api/companies - Creating company for existing user:', data.userId);
      
      // Find the user
      const user = await prisma.user.findUnique({
        where: { id: data.userId }
      });
      
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      
      if (user.companyId) {
        return NextResponse.json({ error: 'User already has a company' }, { status: 409 });
      }
      
      // Create company
      const company = await prisma.company.create({
        data: {
          name: data.name || user.name,
          profile: data.profile || `Company profile for ${user.name}`
        }
      });
      
      // Update user with company ID
      const updatedUser = await prisma.user.update({
        where: { id: data.userId },
        data: { companyId: company.id },
        include: {
          company: true
        }
      });
      
      console.log('POST /api/companies - Company created and linked to user:', company.id);
      return NextResponse.json({
        company,
        user: updatedUser,
        message: 'Company created and linked to user successfully'
      }, { status: 201 });
    }
    
    // Regular company creation
    // Validate required fields
    if (!data.name) {
      console.error('POST /api/companies - Missing company name');
      return NextResponse.json({ 
        error: 'Company name is required' 
      }, { status: 400 });
    }
    
    // Check if company with same name already exists
    const existingCompany = await prisma.company.findFirst({
      where: { name: data.name }
    });
    
    if (existingCompany) {
      console.error('POST /api/companies - Company with name already exists:', data.name);
      return NextResponse.json({ 
        error: 'A company with this name already exists' 
      }, { status: 409 });
    }
    
    const companyData = {
      name: data.name,
      profile: data.profile || null
    };
    
    console.log('POST /api/companies - Creating company with data:', JSON.stringify(companyData, null, 2));
    
    const company = await prisma.company.create({ 
      data: companyData,
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });
    
    console.log('POST /api/companies - Company created successfully:', company.id);
    return NextResponse.json(company, { status: 201 });
    
  } catch (error: any) {
    console.error('POST /api/companies - Error creating company:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: 'A company with this name already exists' 
      }, { status: 409 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to create company',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, ...updateData } = data;
    
    const company = await prisma.company.update({
      where: { id },
      data: updateData,
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });
    return NextResponse.json(company);
  } catch (error: any) {
    console.error('PUT /api/companies error:', error);
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.company.delete({ where: { id } });
    return NextResponse.json({ message: 'Company deleted' });
  } catch (error: any) {
    console.error('DELETE /api/companies error:', error);
    return NextResponse.json({ error: 'Failed to delete company' }, { status: 500 });
  }
} 