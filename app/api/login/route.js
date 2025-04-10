
const {prisma}=require("@/utils/prisma")
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

export async function POST(req) {
  try {
    const body = await req.json();
    const { studentID, password } = body;
    console.log(studentID,password)

    if (!studentID || !password ) {
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
     console.log(student,"student")
    if (!student) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid email or password" }),
        { status: 401, headers: { "student-exam": "error" } }
      );
    }

    const passwordMatch = await bcrypt.compare(password, student.password);
    if (!passwordMatch) {
        console.log("password match",passwordMatch)
      return new NextResponse(
        JSON.stringify({ message: "Invalid email or password" }),
        { status: 401, headers: { "student-exam": "error" } }
      );
    }
    console.log("password match",passwordMatch)

    

    const latestRegistration = student.registrations[0] || {};
    const { grade, year, section } = latestRegistration;

    const token = jwt.sign(
      {
        studentID: student.studentID,
        firstName: student.firstName,
        middleName: student.middleName,
        email: student.email,
        grade,
        year,
        section,
      },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    const cookieStore = await cookies();
    cookieStore.set("studentToken", token, { httpOnly: true, secure: true });

   
    return new NextResponse(
      JSON.stringify({ message: "Login successful", token }),
      { status: 200, headers: { "student-login": "success" } }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500, headers: { "student-login": "error" } }
    );
  }
}
