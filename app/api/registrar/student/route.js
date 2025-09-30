const { prisma } = require('@/utils/prisma');
import { uploadToCloudinary } from "@/utils/cloudinary";
import { sendEmail } from "@/utils/email";
import { hash } from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";
export async function POST(req) {
  try {
    console.log("📥 Receiving form data...");
    const formData = await req.formData();

    console.log("✅ Parsing student and parent data...");
    const studentData = JSON.parse(formData.get("student"));

    if (!studentData.firstName || !studentData.email || !studentData.age || !studentData.grade) {
      console.error("❌ Missing required student fields.");
      return NextResponse.json({ error: "Missing required student fields" }, { status: 400 });
    }

    if ((studentData.grade === "11" || studentData.grade === "12") && !studentData.stream) {
      console.error("❌ Stream is required for grade 11 or 12.");
      return NextResponse.json({ error: "Stream is required for grade 11 or 12." }, { status: 400 });
    }

    const existingYear = await prisma.year.findFirst({
      where: { year: parseInt(studentData.year), status: "active" },
    });
    if (!existingYear) {
      console.error("❌ Year not found.");
      return NextResponse.json({ error: "Year not found" }, { status: 400 });
    }

    const existingGrade = await prisma.grade.findFirst({
      where: { grade: parseInt(studentData.grade) },
    });
    if (!existingGrade) {
      console.error("❌ Grade not found.");
      return NextResponse.json({ error: "Grade not found" }, { status: 400 });
    }

    const existingStudent = await prisma.student.findUnique({
      where: { studentID: studentData.studentID },
    });
    if (existingStudent) {
      console.error("❌ Student ID already exists.");
      return NextResponse.json({ error: "Student ID already exists" }, { status: 400 });
    }

    // --- Image handling ---
    let imageUrl = null;
    const imageFile = formData.get("student.image");

    if (imageFile) {
      if (imageFile.size > 5 * 1024 * 1024) {
        console.error("❌ Image size exceeds 5MB.");
        return NextResponse.json({ error: "Image size exceeds 5MB" }, { status: 400 });
      }
      if (!["image/jpeg", "image/png", "image/webp"].includes(imageFile.type)) {
        console.error("❌ Unsupported image format.");
        return NextResponse.json({ error: "Unsupported image format" }, { status: 400 });
      }

      console.log("🖼️ Uploading image...");
      imageUrl = await uploadToCloudinary(imageFile);
      if (!imageUrl) {
        console.error("❌ Image upload failed!");
        return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
      }
      console.log("🖼️ Image uploaded successfully!");
    }

    // --- Student creation ---
    console.log("🔐 Generating password...");
    const randomPassword = crypto.randomBytes(5).toString("hex");
    const hashedPassword = await hash(randomPassword, 10);

    const newStudent = await prisma.student.create({
      data: {
        studentID: studentData.studentID,
        firstName: studentData.firstName,
        middleName: studentData.middleName,
        lastName: studentData.lastName,
        age: parseInt(studentData.age),
        gender: studentData.gender,
        phoneNumber: studentData.phoneNumber,
        email: studentData.email,
        password: hashedPassword,
        image: imageUrl,
      },
    });

    console.log("📜 Creating registration record...");
    await prisma.registration.create({
      data: {
        studentID: newStudent.studentID,
        stream: studentData.stream || "",
        year: parseInt(studentData.year),
        grade: parseInt(studentData.grade),
        isActive: true,
      },
    });

    // --- Email (non-blocking for success) ---
    try {
      console.log("📧 Sending confirmation email...");
      await sendEmail(
        studentData.email,
        "Your Student Account Credentials",
        `
          <h2>Welcome, ${studentData.firstName}!</h2>
          <p>Your student account has been created successfully.</p>
          <p><strong>Student ID:</strong> ${studentData.studentID}</p>
          <p><strong>Password:</strong> ${randomPassword}</p>
          <p>Please change your password after logging in.</p>
        `
      );
    } catch (emailError) {
      console.warn("⚠️ Email sending failed, but student created:", emailError.message);
    }

    console.log("✅ Student registered successfully!");
    return NextResponse.json({ message: "Student registered successfully!", student: newStudent });

  } catch (error) {
    console.error("🚨 Server error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
