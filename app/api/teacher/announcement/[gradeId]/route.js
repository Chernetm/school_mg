

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ApiError from '@/lib/api-error';
import { prisma } from '@/utils/prisma';
import { getServerSession } from 'next-auth';

import { NextResponse } from "next/server";



export async function POST(req, { params }) {
  try {
    const { gradeId } = await params;
    const body = await req.json();
    const { title, message, audience } = body;

    const session = await getServerSession(authOptions);
    const staffID = session?.user?.staffID;

    if (!staffID) {
      throw new ApiError(403, 'Unauthorized access');
    }

    if (!title || !message || !audience) {
      return new Response(JSON.stringify({ error: 'Missing required fields.' }), { status: 400 });
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

    return new Response(JSON.stringify(announcement), { status: 200 });
  } catch (error) {
    console.error('Create Announcement Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create announcement' }), { status: 500 });
  }
}
