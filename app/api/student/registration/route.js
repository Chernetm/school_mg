const {prisma} = require('@/utils/prisma');
import { getStudentIDFromToken } from '@/utils/auth';
import { NextResponse } from 'next/server';
export async function POST(req) {
  try {
    const body = await req.json();
    const { year, grade, stream } = body;
    console.log("Request body:", body); // Debugging
    
    const studentID = await getStudentIDFromToken();
    console.log("Student ID from token:", studentID); // Debugging

    if (!studentID) {
      return NextResponse.json({ message: 'studentID is required' }, { status: 400 });
    }

    
    const latestYear = await prisma.year.findFirst({
      where: { status: "active" },
      orderBy: { year: "desc" },
      select: { year: true },
    });

    if (!latestYear || latestYear.year !== year) {
      return NextResponse.json({ message: 'Invalid academic year' }, { status: 400 });
    }

    // Step 1: Get latest registration
    const latestRegistration = await prisma.registration.findFirst({
      where: { studentID },
      orderBy: { year: 'desc' },
    });

    if (!latestRegistration) {
      return NextResponse.json({ message: 'No registration found for student' }, { status: 404 });
    }

    const currentGrade = latestRegistration.grade;

    // Step 2: Get semester 3 result summary
    const semester3Summary = await prisma.resultSummary.findFirst({
      where: {
        registrationID: latestRegistration.registrationID,
        semester: 3,
      },
    });

    if (!semester3Summary || semester3Summary.average <= 50) {
      return NextResponse.json({ message: 'Student is not eligible for promotion' }, { status: 400 });
    }

    // Step 3: Register for next grade
    const nextGrade = currentGrade + 1;
    if(!nextGrade===grade){
      return NextResponse.json({ message: 'Invalid grade for registration' }, { status: 400 });
    }
   
    const newStream= stream || latestRegistration.stream;

    const newRegistration = await prisma.registration.create({
      data: {
        studentID,
        grade: nextGrade,
        year,
        stream: newStream,
        isActive: true,
      },
    });

    return NextResponse.json({
      message: 'Student registered for next grade',
      registration: newRegistration,
    }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
