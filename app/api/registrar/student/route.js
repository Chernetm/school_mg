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

    console.log(studentData.studentID);

    if (!studentData.firstName || !studentData.email || !studentData.age || !studentData.grade) {
      console.error("❌ Missing required student fields.");
      return NextResponse.json({ error: "Missing required student fields" }, { status: 400 });
    }

    if ((studentData.grade === "11" || studentData.grade === "12") && !studentData.stream) {
      console.error("❌ Stream is required for grade 11 or 12.");
      return NextResponse.json({ error: "Stream is required for grade 11 or 12." }, { status: 400 });
    }

    console.log("🔐 Generating password...");
    const randomPassword = crypto.randomBytes(5).toString("hex");
    const hashedPassword = await hash(randomPassword, 10);

    console.log("🖼️ Handling image upload...");
    let imageUrl = "";
    const imageFile = formData.get("student.image");

    if (!imageFile) {
      console.error("❌ No image file provided!");
      return NextResponse.json({ error: "Image is required for student registration" }, { status: 400 });
    }
    
    imageUrl = await uploadToCloudinary(imageFile);
    
    const newStudent = await prisma.student.create({
      data: {
        studentID: studentData.studentID,
        firstName: studentData.firstName,
        middleName: studentData.middleName,
        lastName: studentData.lastName,
        age: parseInt(studentData.age),
        phoneNumber: studentData.phoneNumber,
        email: studentData.email,
        password: hashedPassword,
        image: imageUrl,
      },
    });

    console.log("📜 Creating student registration record...");
    await prisma.registration.create({
      data: {
        studentID: newStudent.studentID,
        stream: studentData.stream || "",
        year: parseInt(studentData.year),
        grade: parseInt(studentData.grade),
        isActive: true,
      },
    });

    console.log("📧 Sending confirmation email...");
    await sendEmail(studentData.email, "Your Student Account Credentials", `
      <h2>Welcome, ${studentData.firstName}!</h2>
      <p>Your student account has been created successfully.</p>
      <p><strong>Student ID:</strong> ${studentData.studentID}</p>
      <p><strong>Password:</strong> ${randomPassword}</p>
      <p>Please change your password after logging in.</p>
    `);

    console.log("✅ Student registered successfully!");
    return NextResponse.json({ message: "Student registered successfully!", student: newStudent });

  } catch (error) {
    console.error("❌ Registration Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
