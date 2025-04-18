
const { prisma } = require("@/utils/prisma");
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
   

    const staffID = req.headers.get("x-user-id");
    console.log(staffID);

    const body = await req.json();
    const { studentID, semester, subject, result, grade, section } = body;

    if (!studentID || !semester || !subject || !grade || !section || result === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const currentSemester = await prisma.semester.findUnique({
      where: { name: Number(semester), status: "active" },
      select: { id: true, semester: true },
    });

    if (!currentSemester) {
      return NextResponse.json({ error: "Semester not found" }, { status: 407 });
    }

    const registration = await prisma.registration.findFirst({
      where: { studentID, grade: Number(grade), section },
      select: { registrationID: true },
    });

    if (!registration) {
      return NextResponse.json({ error: "Student registration not found" }, { status: 404 });
    }

    const storedResult = await prisma.resultDetail.upsert({
      where: {
        registrationID_subject_semesterID: {
          registrationID: registration.registrationID,
          subject,
          semester: currentSemester.name, // ✅ use ID, not semester number
        },
      },
      update: {
        score: Number(result),
        staffID,
        semester: currentSemester.name, // ✅ correct foreign key
      },
      create: {
        registrationID: registration.registrationID,
        staffID,
        semester: currentSemester.name, // ✅ correct foreign key
        subject,
        score: Number(result),
      },
    });

    return NextResponse.json(
      { message: "Result uploaded successfully!", result: storedResult },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting result:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
