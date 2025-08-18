import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ApiError from '@/lib/api-error';
import {prisma} from '@/utils/prisma';
import { getServerSession } from 'next-auth';

import { NextResponse } from "next/server";


export async function GET(req) {
const session = await getServerSession(authOptions);
    const studentID = session?.user?.studentID;

    if (!studentID) {
      throw new ApiError(403, 'Unauthorized access');
    }
  try {
    const student = await prisma.student.findUnique({
      where: { studentID },
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        age: true,
        gender: true,
        image:true,

      },
    });
    const registrations = await prisma.registration.findMany({
      where: { studentID },
      include: {
        resultDetail: {
          include: {
            semesterRef: {
              select: { name: true },
            },
          },
        },
        resultSummary: {
          include: {
            semesterRef: {
              select: { name: true },
            },
          },
        },
      },
    });

    const resultsByGrade = {};

    for (const reg of registrations) {
      const gradeKey = `Grade ${reg.grade}`;
      if (!resultsByGrade[gradeKey]) resultsByGrade[gradeKey] = {};

      // Map scores from resultDetail by semester and subject
      for (const result of reg.resultDetail) {
        const semName = `Semester ${result.semesterRef.name}`;

        if (!resultsByGrade[gradeKey][semName]) {
          resultsByGrade[gradeKey][semName] = {
            scores: {},
          };
        }

        const subjectName = result.subject || "Unknown Subject";
        resultsByGrade[gradeKey][semName].scores[subjectName] = result.score ?? 0;
      }

      // Map summary info from resultSummary by semester
      for (const summary of reg.resultSummary) {
        const semName = `Semester ${summary.semesterRef.name}`;

        if (!resultsByGrade[gradeKey][semName]) {
          resultsByGrade[gradeKey][semName] = {
            scores: {},
          };
        }

        resultsByGrade[gradeKey][semName].average = summary.average;
        resultsByGrade[gradeKey][semName].rank = summary.rank;
        resultsByGrade[gradeKey][semName].passStatus = summary.passStatus;
      }
    }

    // Optional: inspect final results for debugging
    console.dir(resultsByGrade, { depth: null });

    return NextResponse.json({student, results: resultsByGrade }, { status: 200 });
  } catch (err) {
    console.error("Error fetching student result:", err);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}