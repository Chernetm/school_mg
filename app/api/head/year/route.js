const { prisma } = require('@/utils/prisma');
import { NextResponse } from "next/server";

// Register a new Year
export async function POST(req) {
  try {
    const { year, status } = await req.json();
    console.log("Incoming year:", year, "Status:", status);

    // Step 1: Validate the incoming data
    if (!year || !status) {
      return NextResponse.json({ error: "Year and status are required" }, { status: 400 });
    }

    // Step 2: Ensure the year is a number
    const yearValue = Number(year);
    if (isNaN(yearValue)) {
      return NextResponse.json({ error: "Year must be a number" }, { status: 400 });
    }

    // Step 3: Check for existing year in the database
    const existingYear = await prisma.year.findUnique({ where: { year: yearValue } });
    if (existingYear) {
      return NextResponse.json({ error: "Year already exists" }, { status: 409 });
    }

    // Step 4: Create a new year entry
    const newYear = await prisma.year.create({
      data: {
        year: yearValue,
        status,
      },
    });

    return NextResponse.json(newYear, { status: 201 });
  } catch (error) {
    console.error("Year creation error:", error); // Full error log for debugging
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// List all years
export async function GET() {
  try {
    const years = await prisma.year.findMany();
    return NextResponse.json(years, { status: 200 });
  } catch (error) {
    console.error("Error fetching years:", error);
    return NextResponse.json({ error: "Error fetching years" }, { status: 500 });
  }
}

// Delete a year
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Year ID is required" }, { status: 400 });
    }

    await prisma.year.delete({ where: { id } });
    return NextResponse.json({ success: "Year deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting year:", error);
    return NextResponse.json({ error: "Error deleting year" }, { status: 500 });
  }
}

// Update year status
export async function PUT(req) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "Year ID and status are required" }, { status: 400 });
    }

    const updatedYear = await prisma.year.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedYear, { status: 200 });
  } catch (error) {
    console.error("Error updating year status:", error);
    return NextResponse.json({ error: "Error updating year status" }, { status: 500 });
  }
}
