const { prisma } = require('@/utils/prisma');
import { NextResponse } from 'next/server';

export async function GET(req) {
  console.log('🚀 API HIT: /api/teacher/student');

  try {
    const { searchParams } = new URL(req.url);
    const grade = searchParams.get('grade');
    const section = searchParams.get('section');
    const year = searchParams.get('year');

    console.log('📌 Params Received - Grade:', grade, 'Section:', section, 'Year:', year);

    if (!grade || !section || !year) {
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
            section,
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
