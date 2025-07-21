
const { prisma } = require("@/utils/prisma");
const { NextResponse } = require("next/server");
// pages/api/staff/index.js

export async function GET() {
  
    try {
      const staff = await prisma.staff.findMany();
      return Response.json(staff, { status: 201 });
    } catch (error) {
      return NextResponse.json({ message:'Error fetching', error:error.message || error }, { status: 500  });
    }
}


export async function PUT(req) {
  try {
    const body = await req.json();
    const { staffID, status, role } = body;
    console.log("Request Body:", body);

    if (staffID == null || !status || !role) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const updatedStaff = await prisma.staff.update({
      where: { staffID: Number(staffID) }, // Change to `staffID` if that's your primary key
      data: { status, role },
    });

    return NextResponse.json(updatedStaff, { status: 200 });
  } catch (error) {
    console.error("Error updating staff:", error);
    return NextResponse.json({
      message: "Error updating staff",
      error: error.message || error
    }, { status: 500 });
  }
}
