const { prisma } = require("@/utils/prisma");
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

export async function POST(req) {
  try {
    const body = await req.json();
    const { studentID, password } = body;
    console.log("🔐 Login Attempt:", studentID, password);

    if (!studentID || !password) {
      return new NextResponse(
        JSON.stringify({ message: "Missing credentials" }),
        { status: 400, headers: { "student-exam": "error" } }
      );
    }

    const student = await prisma.student.findUnique({
      where: { studentID },
      select: {
        studentID: true,
        firstName: true,
        middleName: true,
        email: true,
        password: true,
        registrations: {
          orderBy: { year: "desc" },
          take: 1,
          select: { grade: true, year: true, section: true },
        },
      },
    });

    if (!student) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid student ID or password" }),
        { status: 401, headers: { "student-exam": "error" } }
      );
    }

    const passwordMatch = await bcrypt.compare(password, student.password);
    if (!passwordMatch) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid student ID or password" }),
        { status: 401, headers: { "student-exam": "error" } }
      );
    }
    const latestRegistration = student.registrations[0] || {};
    console.log(latestRegistration, "latest registration");
    
    if (!latestRegistration || !latestRegistration.grade) {
      return new NextResponse(
        JSON.stringify({ message: "Registration info missing for student" }),
        { status: 403, headers: { "student-login": "error" } }
      );
    }
    const { grade, year, section } = latestRegistration;    
    // ✅ Include role for middleware
    const token = jwt.sign(
      {
        studentID: student.studentID,
        firstName: student.firstName,
        middleName: student.middleName,
        email: student.email,
        grade,
        year,
        section,
        role: "student",
      },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    // ✅ Set cookie using NextResponse
    const res = new NextResponse(
      JSON.stringify({ message: "Login successful", token }),
      { status: 200, headers: { "student-login": "success" } }
    );

    res.cookies.set("studentToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return res;

  } catch (error) {
    console.error("❌ Login Error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500, headers: { "student-login": "error" } }
    );
  }
}
