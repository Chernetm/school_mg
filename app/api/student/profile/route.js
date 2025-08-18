


import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ApiError from '@/lib/api-error';
import {prisma} from '@/utils/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';



export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session data:", session);
    const studentID = session?.user?.studentID;

    if (!studentID) {
          throw new ApiError(403, 'Unauthorized access');
    }

    const student = await prisma.student.findUnique({
      where: { studentID },
      select: {
        studentID: true,
        firstName: true,
        middleName: true,
        email: true,
        image:true,


        registrations: {
              orderBy: { createdAt: 'desc' },
              select: {
                grade: true, year: true, section: true,
      
              },
            },
      },
    });
    console.log("Fetched student data:", student);

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, {status: 404});
    }

    return  NextResponse.json(student);
  } catch (error) {
    console.error("Fetch Student Error:", error);
    return NextResponse.json({ message: "Internal Server Error" },{status: 500});
  }
}
