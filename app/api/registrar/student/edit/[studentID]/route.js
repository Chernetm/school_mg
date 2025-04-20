import { uploadToCloudinary } from "@/utils/cloudinary";
import { prisma } from '@/utils/prisma';
import { hash } from "bcryptjs";
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { studentID } = await params;

  if (!studentID) {
    return NextResponse.json({ error: "Invalid student ID" }, { status: 400 });
  }

  try {
    console.log("Fetching student:", studentID); // Debugging

    const student = await prisma.student.findUnique({
      where: { studentID: studentID },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Exclude password before sending response
    const { password, ...studentWithoutPassword } = student;

    return NextResponse.json(studentWithoutPassword);
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json({ error: "Error fetching student" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { studentID } = await params;

  // Check if the student ID is provided
  if (!studentID) {
    return NextResponse.json({ error: "Student ID is required!" }, { status: 400 });
  }

  try {
    const formData = await req.formData();

    // Extract individual fields
    const firstName = formData.get("firstName");
    const middleName = formData.get("middleName");
    const lastName = formData.get("lastName");
    const age = formData.get("age");
    const phoneNumber = formData.get("phoneNumber");
    const email = formData.get("email");
    const parentID = formData.get("parentID");

    let password = formData.get("password");

    // Handle image (extract new file if exists)
    let imageUrl = formData.get("image"); // Existing image or new file
    const imageFiles = formData.getAll("image");
    const newImageFile = imageFiles.find((file) => file instanceof File);
    

    if (newImageFile) {
      imageUrl = await uploadToCloudinary(newImageFile);
    }
  
   


    // Hash password if a new one is provided
    let hashedPassword = undefined;
    if (password) {
      hashedPassword = await hash(password, 10);
    }

    // Prepare the update data object
    const updateData = {};
    if (firstName) updateData.firstName = firstName.trim();
    if (middleName) updateData.middleName = middleName.trim();
    if (lastName) updateData.lastName = lastName.trim();
    if (age) updateData.age = parseInt(age, 10);
    if (phoneNumber) updateData.phoneNumber = phoneNumber.trim();
    if (email) updateData.email = email.trim();
    if (parentID) updateData.parentID = parseInt(parentID, 10);
    if (imageUrl) updateData.image = imageUrl;
    if (hashedPassword) updateData.password = hashedPassword;

    // Validate that at least one field is provided for update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields provided for update" }, { status: 400 });
    }

    // Check if the student exists before updating
    const existingStudent = await prisma.student.findUnique({
      where: { studentID: studentID },
    });

    if (!existingStudent) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Update the student in the database
    const updatedStudent = await prisma.student.update({
      where: { studentID: studentID },
      data: updateData,
    });

    // Respond with the updated student data
    return NextResponse.json(updatedStudent);

  } catch (error) {
  
    return NextResponse.json({ error: "Error updating student" }, { status: 500 });
  }
}
