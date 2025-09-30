import { prisma } from '@/utils/prisma';
import { uploadToCloudinary } from "@/utils/cloudinary";
import { NextResponse } from "next/server";
import ApiError from '@/lib/api-error';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image");

    if (!imageFile) {
      return NextResponse.json({ message: "No image provided" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const studentID = session?.user?.studentID;

    if (!studentID) {
      throw new ApiError(403, 'Unauthorized access');
    }

    // Fetch student with latest registration
    const student = await prisma.student.findUnique({
      where: { studentID },
      select: {
        studentID: true,
        image: true,
        registrations: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { grade: true }
        },
      },
    });

    if (!student || student.registrations[0]?.grade !== 12) {
      return NextResponse.json({ message: "Student not found or not in grade 12" }, { status: 404 });
    }

    // Validate image
    if (imageFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Image size exceeds 5MB" }, { status: 400 });
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(imageFile.type)) {
      return NextResponse.json({ error: "Unsupported image format" }, { status: 400 });
    }

    // Upload image
    const imageUrl = await uploadToCloudinary(imageFile);
    if (!imageUrl) {
      return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
    }

    // Update student image
    const updatedStudent = await prisma.student.update({
      where: { studentID },
      data: { image: imageUrl },
    });

    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error("Error updating student image:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
