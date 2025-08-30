const { prisma } = require('@/utils/prisma');
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const grade = searchParams.get('grade');
  const section = searchParams.get('section');
  const semester = searchParams.get('semester');

  if (!grade || !section || !semester) {
    return NextResponse.json(
      { error: 'Grade, Section and Semester required', students: [] },
      { status: 400 }
    );
  }

  try {
    const students = await prisma.student.findMany({
      where: {
        registrations: {
          some: {
            grade: parseInt(grade),
            section,
            isActive: true,
          },
        },
      },
      select: {
        studentID: true,
        firstName: true,
        middleName: true,
        lastName: true,
        registrations: {
          where: {
            grade: parseInt(grade),
            section,
            isActive: true,
          },
          select: {
            resultDetail: {
              where: { semester: parseInt(semester) },
              orderBy: { id: 'desc' }, // use id since ResultDetail has no createdAt
              take: 1,
              select: { score: true },
            },
          },
        },
      },
    });

    // Flatten so frontend can read `student.resultDetails[0]?.score`
    const formatted = students.map((student) => ({
      ...student,
      resultDetails: student.registrations.flatMap((r) => r.resultDetail),
    }));

    return NextResponse.json({ students: formatted }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Server error', students: [] },
      { status: 500 }
    );
  }
}
