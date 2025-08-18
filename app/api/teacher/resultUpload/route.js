

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ApiError from '@/lib/api-error';
import {prisma} from '@/utils/prisma';
import { getServerSession } from 'next-auth';

import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const staffID = session?.user?.staffID;

    if (!staffID) {
      throw new ApiError(403, 'Unauthorized access');
    }

    const body = await req.json();
    const { results } = body;
    console.log("Results received:", results);

    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json({ error: "Results array is required" }, { status: 400 });
    }

    const semesterName = results[0].semester;
    const currentSemester = await prisma.semester.findUnique({
      where: { name: semesterName, status:"active" },
    });

    if (!currentSemester || currentSemester.status !== "active") {
      return NextResponse.json({ error: "Semester is not active" }, { status: 407 });
    }

    const uploadedResults = [];

    for (const resultItem of results) {
      const { studentID, subject, result, grade, section,semester } = resultItem;

      if (!studentID || !subject || result === undefined || !grade || !section) continue;

      const registration = await prisma.registration.findFirst({
        where: { studentID, grade, section },
        select: { registrationID: true },
      });

      if (!registration) {
        console.warn(`No registration found for student ${studentID}`);
        continue;
      }

      const stored = await prisma.resultDetail.upsert({
        where: {
          registrationID_subject_semester: {
            registrationID: registration.registrationID,
            subject,
            semester: Number(semester)
          },
        },
        update: {
          score: Number(result),
          staffID,
        },
        create: {
          registrationID: registration.registrationID,
          staffID,
          semester: Number(semester),
          subject,
          score: Number(result),
        },
      });

      uploadedResults.push(stored);
    }

    return NextResponse.json(
      {
        message: "Results uploaded successfully",
        uploadedCount: uploadedResults.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting result:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}