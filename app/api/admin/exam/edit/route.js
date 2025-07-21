import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ApiError from '@/lib/api-error';
import {prisma} from '@/utils/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['admin'].includes(session.user.role)) {
      throw new ApiError(403, 'Unauthorized access');
    }
    
    const { searchParams } = new URL(request.url);
    const grade = searchParams.get('grade');

    if (!grade || isNaN(parseInt(grade))) {
      throw new ApiError(400, 'Grade is required and must be a number');
    }

    const exams = await prisma.exam.findMany({
      where: { 
        grade: parseInt(grade),
      },
      select: {
        id: true,
        title: true,
        grade: true,
        status: true,
        type: true,
        description: true,
        durationMinutes: true,
        createdBy: true,
        //createdAt: true,
      },
    });

    return NextResponse.json(exams);
  } catch (error) {
    console.error('Error fetching exams:', error);
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: 'Failed to fetch exams' }, { status: 500 });
  }
}
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['admin'].includes(session.user.role)) {
      throw new ApiError(403, 'Unauthorized access');
    }
    

    const createdBy = session.user.staffID;
    const { examId, title, description, grade, status, type, durationMinutes } = await request.json();

    if (!examId) {
      throw new ApiError(400, 'Exam ID is required');
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (grade !== undefined) updateData.grade = parseInt(grade);
    if (status) updateData.status = status;
    if (type) updateData.type = type;
    if (durationMinutes !== undefined) updateData.durationMinutes = parseInt(durationMinutes);
    if(createdBy) updateData.createdBy=createdBy;
    

    const updatedExam = await prisma.exam.update({
      where: { 
        id: parseInt(examId),
      },
      data: updateData,
      select: {
        id: true,
        title: true,
        grade: true,
        status: true,
        type: true,
        description: true,
        durationMinutes: true,
        createdBy: true,
        //createdAt: true,
      },
    });

    return NextResponse.json(updatedExam);
  } catch (error) {
    console.error('Error updating exam:', error);
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: 'Failed to update exam' }, { status: 500 });
  }
}