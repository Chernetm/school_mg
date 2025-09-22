import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ApiError from '@/lib/api-error';
import { prisma } from '@/utils/prisma';
import { getServerSession } from 'next-auth';
const { NextResponse } = require("next/server");

// GET: Fetch staff list excluding the logged-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const staffID = session?.user?.staffID;

    if (!staffID) {
      throw new ApiError(403, 'Unauthorized access');
    }

    const staff = await prisma.staff.findMany({
      where: {
        NOT: {
          staffID: Number(staffID), // Exclude the logged-in user
        },
      },
    });

    return NextResponse.json(staff, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching staff', error: error.message || error },
      { status: 500 }
    );
  }
}

// PUT: Update staff but not allow self-update
export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    const currentStaffID = session?.user?.staffID;

    if (!currentStaffID) {
      throw new ApiError(403, 'Unauthorized access');
    }

    const body = await req.json();
    const { staffID, status, role } = body;
    console.log("Request Body:", body);

    if (!staffID || !status || !role) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (Number(staffID) === Number(currentStaffID)) {
      return NextResponse.json(
        { message: "You cannot update your own account" },
        { status: 403 }
      );
    }

    const updatedStaff = await prisma.staff.update({
      where: { staffID: Number(staffID) },
      data: { status, role },
    });

    return NextResponse.json(updatedStaff, { status: 200 });
  } catch (error) {
    console.error("Error updating staff:", error);
    return NextResponse.json(
      { message: "Error updating staff", error: error.message || error },
      { status: 500 }
    );
  }
}
