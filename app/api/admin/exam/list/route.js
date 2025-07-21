import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ApiError from '@/lib/api-error';
import {prisma} from '@/utils/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
      const session = await getServerSession(authOptions);
      
      if (!session || !['admin'].includes(session.user.role)) {
        throw new ApiError(403, 'Unauthorized access');
      }
  
      // Fetch all responses and include exam info
      const submissions = await prisma.response.findMany({
        
        include: {
          exam: {
            select: {
              id: true,
              title: true,
              status: true,
              type: true,
            },
          },
        },
      });

      console.log("Exam submission",submissions)
  
      // Filter to only ACTIVE, MODEL exams and deduplicate
      const examMap = new Map();
      submissions.forEach((submission) => {
        const exam = submission.exam;
        if (exam && exam.status === 'ACTIVE') {
          examMap.set(exam.id, {
            id: exam.id,
            title: exam.title,
          });
        }
      });
  
      const exams = Array.from(examMap.values());
      console.log(exams, "Exam")
  
      return NextResponse.json({ exams }, { status: 200 });
    } catch (error) {
      console.error('Error fetching exams:', error);
      if (error instanceof ApiError) {
        return NextResponse.json({ message: error.message }, { status: error.status });
      }
      return NextResponse.json({ message: 'Failed to fetch exams' }, { status: 500 });
    }
  }
  