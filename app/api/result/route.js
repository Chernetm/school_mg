const { prisma } = require("@/utils/prisma");
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const token = req.cookies.get("staffToken")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }
    const staffID = decoded.staffID;

    const body = await req.json();
    const { studentID, semester, subject, result, grade, section } = body;

    if (!studentID || !semester || !subject || !grade || !section || result === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const semesterRecord = await prisma.semester.findUnique({
      where: { semester: Number(semester), status: "active"},
      select: { id: true },
    });

    if (!semesterRecord) {
      return NextResponse.json({ error: "Semester not found" }, { status: 404 });
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
        registrationID_subject: { registrationID: registration.registrationID, subject },
      },
      update: { score: Number(result), staffID, semesterID: semesterRecord.id },
      create: {
        registrationID: registration.registrationID,
        staffID,
        semesterID: semesterRecord.id,
        subject,
        score: Number(result),
      },
    });

    return NextResponse.json({ message: "Result uploaded successfully!", result: storedResult }, { status: 201 });
  } catch (error) {
    console.error("Error submitting result:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
