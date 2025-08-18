import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ApiError from '@/lib/api-error';
import {prisma} from '@/utils/prisma';
import { getServerSession } from 'next-auth';

import { NextResponse } from "next/server";


export async function GET() {
  

  try {


    const session = await getServerSession(authOptions);
    const studentID = session?.user?.studentID;

    if (!studentID) {
      throw new ApiError(403, 'Unauthorized access');
    }
    const disciplines = await prisma.disciplineRecord.findMany({
      where: { studentID}, // Ensure it's a number if `studentID` is Int
      select: {
        id: true,
        message: true,
        createdAt: true,
        student: {
          select: {
            firstName: true,
            lastName: true,
            middleName: true,
          },
        },
      },
    });

    return NextResponse.json(disciplines);
  } catch (error) {
    console.error("Error fetching discipline records:", error);
    return NextResponse.json({ error: "Failed to fetch disciplines" }, { status: 500 });
  }
}
