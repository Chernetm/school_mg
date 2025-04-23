const { prisma } = require('@/utils/prisma');
import { NextResponse } from 'next/server';

export async function GET(req) {
  console.log('🚀 API HIT: /api/teacher/student');

  try {
    const { searchParams } = new URL(req.url);
    const grade = searchParams.get('grade');
    const year = searchParams.get('year');

    console.log('📌 Params Received - Grade:', grade,'Year:', year);

    if (!grade || !year) {
      return NextResponse.json(
        { error: 'Grade, Section, and Year are required.', students: [] },
        { status: 400 }
      );
    }

    const students = await prisma.student.findMany({
      where: {
        registrations: {
          some: {
            grade: parseInt(grade),
            year: parseInt(year),
            isActive: true,
          },
        },
      },
      select: {
        firstName: true,
        lastName: true,
        studentID: true,
      },
    });

    console.log('📌 Students Found:', students.length);
    return NextResponse.json({ students }, { status: 200 });
  } catch (error) {
    console.error('❌ Error in API:', error);
    return NextResponse.json(
      { error: 'Internal server error', students: [] },
      { status: 500 }
    );
  }
}
