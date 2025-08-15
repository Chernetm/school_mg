
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ApiError from '@/lib/api-error';
import {prisma} from '@/utils/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';



export async function POST(req) {
  try {
    const body = await req.json();
    const { title, message, audience, gradeId } = body;
    
    console.log(title, message, audience, gradeId)
    console.log(gradeId)
    
    const session = await getServerSession(authOptions);
    console.log("Session data:", session);
    const staffID = session?.user?.staffID;

    if (!session  || !['admin', 'head', 'registrar', 'teacher', 'library'].includes(session.user.role)) {
      throw new ApiError(403, 'Unauthorized access');
    }
    
  
    if (!title || !message || !audience) {
      return Response.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        message,
        audience,
        gradeId: audience === 'GRADE' ? Number(gradeId) : null,
        staffID: Number(staffID),
      },
    });

    console.log(announcement)

    return Response.json(announcement, { status: 200 });
  } catch (error) {
   console.error('Create Announcement Error:', error);
    return Response.json({ error: 'Failed to create announcement' }, { status: 500 });
  }
}
