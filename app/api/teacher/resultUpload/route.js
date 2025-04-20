
const { prisma } = require("@/utils/prisma");
import { getStaffIDFromToken } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const staffID = Number(await getStaffIDFromToken());
    console.log(staffID);
    if (!staffID) {
      return NextResponse.json({ error: "Missing staff ID" }, { status: 401 });
    }

    const body = await req.json();
    const { results } = body;

    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json({ error: "Results array is required" }, { status: 400 });
    }

    const semesterName = results[0].semester;
    console.log(semesterName);

    const currentSemester = await prisma.semester.findUnique({
      where: { name: semesterName , status: "active" },
      select: { id: true, name: true },
    });
    console.log(currentSemester, "The current semester");
    if (!currentSemester) {
      return NextResponse.json({ error: "Semester is not Active" }, { status: 407 });
    }

    const uploadedResults = [];

    for (const resultItem of results) {
      const { studentID, subject, result, grade, section } = resultItem;

      if (!studentID || !subject || result === undefined || !grade || !section) {
        continue; // Skip invalid entries instead of failing the entire batch
      }

      const registration = await prisma.registration.findFirst({
        where: {
          studentID,
          grade,
          section,
        },
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
            semester: currentSemester.name, // ✅ Use correct foreign key field
          },
        },
        update: {
          score: Number(result),
          staffID,
        },
        create: {
          registrationID: registration.registrationID,
          staffID,
          semester: currentSemester.name, // ✅ Use semester ID here
          subject,
          score: Number(result),
        },
      });

      uploadedResults.push(stored);
    }

    return NextResponse.json(
      { message: "Results uploaded successfully", uploadedCount: uploadedResults.length },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting result:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
