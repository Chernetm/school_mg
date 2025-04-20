const{prisma}=require("@/utils/prisma")

import { getStudentIDFromToken } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const studentID = await getStudentIDFromToken();
    console.log("Student ID from token:", studentID); // Debugging
    
    if (!studentID) {
          return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const student = await prisma.student.findUnique({
      where: { studentID },
      select: {
        studentID: true,
        firstName: true,
        middleName: true,
        email: true,
        image:true,
        registrations: {
          orderBy: { year: "desc" },
          take: 1,
          select: { grade: true, year: true, section: true },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, {status: 404});
    }

    return  NextResponse.json(student);
  } catch (error) {
    console.error("Fetch Student Error:", error);
    return NextResponse.json({ message: "Internal Server Error" },{status: 500});
  }
}
