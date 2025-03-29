const { prisma } =require("@/utils/prisma");
import { parse } from "cookie";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Get token from cookies
    const cookies = parse(req.headers.get("cookie") || "");
    const token = cookies.staffToken;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify JWT and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch staff data with grade and section names
    const staff = await prisma.staff.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        staffID: true,
        username: true,
        role: true,
        assignment: {
          select: {
            grade: {
              select: {
                grade: true, // Fetch grade value
              },
            },
            section: {
              select: {
                section: true, // Fetch section value
              },
            },
            subject: {
              select: {
                name: true, // Fetch subject name
              },
            },
          },
        },
      },
    });

    if (!staff) {
      return NextResponse.json({ message: "Staff not found" }, { status: 404 });
    }

    // Map the data to a cleaner structure
    const responseData = {
      id: staff.id,
      staffID: staff.staffID,
      username: staff.username,
      role: staff.role,
      assignments: staff.assignment.map((assignment) => ({
        grade: assignment.grade.grade,
        section: assignment.section.section,
        subject: assignment.subject.name,
      })),
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("❌ Error fetching staff data:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
