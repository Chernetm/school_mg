
const {prisma}=require("@/utils/prisma")
import { getSession, saveSession } from "@/utils/sessionStore";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

export async function POST(req) {
  try {
    const body = await req.json();
    const { studentID, password, deviceFingerprint } = body;
    console.log(studentID,password,deviceFingerprint)

    if (!studentID || !password || !deviceFingerprint) {
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
        JSON.stringify({ message: "Invalid studentID or password" }),
        { status: 401, headers: { "student-exam": "error" } }
      );
    }

    const passwordMatch = await bcrypt.compare(password, student.password);
    if (!passwordMatch) {
        console.log("password match",passwordMatch)
      return new NextResponse(
        JSON.stringify({ message: "Invalid studentID or password" }),
        { status: 401, headers: { "student-exam": "error" } }
      );
    }
    console.log("password match",passwordMatch)

    const existingSession = await getSession(student.studentID);
    if (existingSession && existingSession.deviceFingerprint !== deviceFingerprint) {
      return new NextResponse(
        JSON.stringify({ message: "Access denied: Unauthorized device" }),
        { status: 403, headers: { "student-exam": "error" } }
      );
    }

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
        deviceFingerprint,
      },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    const cookieStore = await cookies();
    cookieStore.set("examToken", token, { httpOnly: true, secure: true });

    await saveSession(student.studentID, deviceFingerprint);

    return new NextResponse(
      JSON.stringify({ message: "Login successful", token }),
      { status: 200, headers: { "student-exam": "success" } }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500, headers: { "student-exam": "error" } }
    );
  }
}
