const {prisma}=require("@/utils/prisma")
import { NextResponse } from "next/server";
// Adjust the import based on your project

export async function POST(req) {
  try {
    const { newGrade, newSection, newYear } = await req.json();
    const studentID = req.headers.get("x-student-id");
    const grade = req.headers.get("x-student-grade");
    
    if (!studentID) {
          return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

    // ✅ 1️⃣ Get latest registration record for the student
    const latestRegistration = await prisma.registration.findFirst({
      where: { studentID },
      orderBy: { year: "desc" }, // Get the most recent year
    });

    // ❌ If no record found, student is not registered
    if (!latestRegistration) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    // ✅ 2️⃣ Check if the student passed or failed
    if (latestRegistration.passStatus !== "passed") {
      return NextResponse.json({ message: "Student failed, cannot register for the next grade" }, { status: 403 });
    }

    // ✅ 3️⃣ Register student for the next grade
    const newRegistration = await prisma.registration.create({
      data: {
        studentID,
        grade: newGrade,
        section: newSection,
        year: newYear,
        isActive: true,
        status: "undetermined", // Set default status
      },
    });

    return NextResponse.json({ message: "Student registered for next grade", registration: newRegistration }, { status: 201 });
  } catch (error) {
    console.error("Error processing registration:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
