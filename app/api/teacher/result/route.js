import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const grade = searchParams.get('grade');
    const section = searchParams.get('section');

    // ✅ get logged-in teacher
    const session = await getServerSession(authOptions);
    const teacherId = session?.user?.staffID;

    if (!teacherId) {
      return NextResponse.json(
        { error: 'Unauthorized access', students: [] },
        { status: 403 }
      );
    }

    if (!grade || !section) {
      return NextResponse.json(
        { error: 'Grade and Section required', students: [] },
        { status: 400 }
      );
    }

    // ✅ Find active semesters ordered DESC
    const activeSemesters = await prisma.semester.findMany({
      where: { status: 'active' },
      orderBy: { name: 'desc' },
      select: { name: true },
    });

    const latestSemester = activeSemesters[0]?.name;

    // ✅ Fetch students with results from that semester, submitted by the teacher
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
              where: {
                semester: latestSemester, // ✅ semester from Semester model
                staffID: teacherId,        // ✅ only current teacher
              },
              orderBy: { id: 'desc' },
              select: {
                id: true,
                subject: true,
                score: true,
                semester: true,
                staffID: true,
              },
            },
          },
        },
      },
    });

    // ✅ Flatten results for frontend
    const formatted = students.map((student) => ({
      studentID: student.studentID,
      firstName: student.firstName,
      middleName: student.middleName,
      lastName: student.lastName,
      results: student.registrations.flatMap((r) => r.resultDetail) ?? [],
    }));

    return NextResponse.json(
      { semester: latestSemester, students: formatted },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error fetching student transcript data:', err);
    return NextResponse.json(
      { error: 'Server error', students: [] },
      { status: 500 }
    );
  }
}
