import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('companyId');
    
    if (companyId) {
      // Fetch applications for a specific company
      console.log('GET /api/applications - Fetching applications for company:', companyId);
      
      const applications = await prisma.application.findMany({
        where: {
          job: {
            companyId: companyId
          }
        },
        include: {
          job: {
            include: {
              company: {
                select: {
                  name: true
                }
              }
            }
          },
          user: {
            include: {
              resumes: {
                orderBy: {
                  createdAt: 'desc'
                },
                take: 1,
                select: {
                  id: true,
                  url: true,
                  createdAt: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      console.log('GET /api/applications - Found', applications.length, 'applications for company');
      return NextResponse.json(applications);
    } else {
      // Fetch all applications (for admin purposes)
      const applications = await prisma.application.findMany({
        include: {
          job: {
            include: {
              company: {
                select: {
                  name: true
                }
              }
            }
          },
          user: {
            select: {
              name: true,
              email: true
            },
            include: {
              resumes: {
                orderBy: {
                  createdAt: 'desc'
                },
                take: 1
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      return NextResponse.json(applications);
    }
  } catch (error) {
    console.error('GET /api/applications error:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('POST /api/applications - Starting application creation...');
    
    const data = await req.json();
    console.log('POST /api/applications - Received data:', JSON.stringify(data, null, 2));
    
    // Validate required fields
    const requiredFields = ['jobId', 'userId'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.error('POST /api/applications - Missing required fields:', missingFields);
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }
    
    // Validate UUID format
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.jobId)) {
      console.error('POST /api/applications - Invalid jobId format:', data.jobId);
      return NextResponse.json({ 
        error: 'Invalid job ID format' 
      }, { status: 400 });
    }
    
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.userId)) {
      console.error('POST /api/applications - Invalid userId format:', data.userId);
      return NextResponse.json({ 
        error: 'Invalid user ID format' 
      }, { status: 400 });
    }
    
    // Check if job exists and is active
    const job = await prisma.job.findUnique({
      where: { id: data.jobId },
      include: {
        company: {
          select: {
            name: true
          }
        }
      }
    });
    
    if (!job) {
      console.error('POST /api/applications - Job not found:', data.jobId);
      return NextResponse.json({ 
        error: 'Job not found' 
      }, { status: 404 });
    }
    
    if (!job.isActive) {
      console.error('POST /api/applications - Job is not active:', data.jobId);
      return NextResponse.json({ 
        error: 'This job posting is no longer active' 
      }, { status: 400 });
    }
    
    console.log('POST /api/applications - Job found:', job.title);
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: data.userId }
    });
    
    if (!user) {
      console.error('POST /api/applications - User not found:', data.userId);
      return NextResponse.json({ 
        error: 'User not found' 
      }, { status: 404 });
    }
    
    if (user.role !== 'SEEKER') {
      console.error('POST /api/applications - User is not a seeker:', user.role);
      return NextResponse.json({ 
        error: 'Only job seekers can apply for jobs' 
      }, { status: 403 });
    }
    
    console.log('POST /api/applications - User found:', user.name);
    
    // Check if user has already applied for this job
    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId: data.jobId,
        userId: data.userId
      }
    });
    
    if (existingApplication) {
      console.error('POST /api/applications - User already applied for this job');
      return NextResponse.json({ 
        error: 'You have already applied for this job' 
      }, { status: 409 });
    }
    
    // Create application
    const applicationData = {
      jobId: data.jobId,
      userId: data.userId,
      message: data.message || null,
      status: 'PENDING' as const
    };
    
    console.log('POST /api/applications - Creating application with data:', JSON.stringify(applicationData, null, 2));
    
    const application = await prisma.application.create({
      data: applicationData,
      include: {
        job: {
          include: {
            company: {
              select: {
                name: true
              }
            }
          }
        },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    
    console.log('POST /api/applications - Application created successfully:', application.id);
    return NextResponse.json(application, { status: 201 });
    
  } catch (error: any) {
    console.error('POST /api/applications - Error creating application:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: 'You have already applied for this job' 
      }, { status: 409 });
    }
    
    if (error.code === 'P2003') {
      return NextResponse.json({ 
        error: 'Invalid job or user reference' 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to create application',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, ...updateData } = data;
    
    console.log('PUT /api/applications - Updating application:', id);
    
    const application = await prisma.application.update({
      where: { id },
      data: updateData,
      include: {
        job: {
          include: {
            company: {
              select: {
                name: true
              }
            }
          }
        },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    
    console.log('PUT /api/applications - Application updated successfully');
    return NextResponse.json(application);
  } catch (error: any) {
    console.error('PUT /api/applications error:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    
    console.log('DELETE /api/applications - Deleting application:', id);
    
    await prisma.application.delete({ where: { id } });
    
    console.log('DELETE /api/applications - Application deleted successfully');
    return NextResponse.json({ message: 'Application deleted' });
  } catch (error: any) {
    console.error('DELETE /api/applications error:', error);
    return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 });
  }
} 