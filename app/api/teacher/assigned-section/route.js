



import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ApiError from '@/lib/api-error';
import {prisma} from '@/utils/prisma';
import { getServerSession } from 'next-auth';

import { NextResponse } from "next/server";



export async function GET(req) {
  try {
    // Get token from cookies
   const session = await getServerSession(authOptions);
    const staffID = session?.user?.staffID;

    if (!staffID) {
      throw new ApiError(403, 'Unauthorized access');
    }
    // Fetch staff data with grade and section names
    const staff = await prisma.staff.findUnique({
      where: { staffID: Number(staffID) },
      select: {
        id: true,
        staffID: true,
        username: true,
        role: true,
        assignment: {
          select: {
            grade: {
              select: {
                grade: true, // Fetch grade value
              },
            },
            section: {
              select: {
                section: true, // Fetch section value
              },
            },
            subject: {
              select: {
                name: true, // Fetch subject name
              },
            },
          },
        },
      },
    });

    if (!staff) {
      return NextResponse.json({ message: "Staff not found" }, { status: 404 });
    }

    // Map the data to a cleaner structure
    const responseData = {
      id: staff.id,
      staffID: staff.staffID,
      username: staff.username,
      role: staff.role,
      assignments: staff.assignment.map((assignment) => ({
        grade: assignment.grade.grade,
        section: assignment.section.section,
        subject: assignment.subject.name,
      })),
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("❌ Error fetching staff data:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
