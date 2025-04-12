const {prisma}=require('@/utils/prisma')
import { NextResponse } from "next/server";


// Register a new semester
export async function POST(req) {
  try {
    const { semester, status } = await req.json();
    console.log(semester,status)
    
    if (!semester || !status) {
      return NextResponse.json({ error: "Semester and status are required" }, { status: 400 });
    }

    const newSemester = await prisma.semester.create({
      data: { semester, status }
    });

    return NextResponse.json(newSemester, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error creating semester" }, { status: 500 });
  }
}

// List all semesters
export async function GET() {
  try {
    const semesters = await prisma.semester.findMany();
    return NextResponse.json(semesters, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching semesters" }, { status: 500 });
  }
}

// Delete a semester
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Semester ID is required" }, { status: 400 });
    }

    await prisma.semester.delete({ where: { id } });
    return NextResponse.json({ success: "Semester deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting semester" }, { status: 500 });
  }
}

// Update semester status
export async function PUT(req) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "Semester ID and status are required" }, { status: 400 });
    }

    const updatedSemester = await prisma.semester.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(updatedSemester, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error updating semester status" }, { status: 500 });
  }
}
