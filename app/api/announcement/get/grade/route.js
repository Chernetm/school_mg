

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ApiError from '@/lib/api-error';
import { prisma } from '@/utils/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';



export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session data:", session);
    const gradeId = session?.user?.grade;

    if (!session) {
      throw new ApiError(403, 'Unauthorized access');
    }
  console.log(gradeId,"gradeId");

    const announcements = await prisma.announcement.findMany({
      where: {
        audience: "GRADE",
        gradeId: Number(gradeId),
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        staff: {
          select: {
            firstName: true,
            lastName: true,
            image: true,
          },
        },
      },
    });
     console.log(announcements,"announcement-grade")
    return Response.json(announcements, { status: 200 });
  } catch (error) {
    console.error("Fetch Announcements Error:", error);
    return Response.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}
