
const { prisma } = require("@/utils/prisma");
// pages/api/staff/index.js

export async function GET() {
  
    try {
      const staff = await prisma.staff.findMany();
      return Response.json(staff, { status: 201 });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching staff' });
    }
}

export async function PUT(req) {
  try {
    const body = await req.json(); // Extract JSON data
    const { staffID, status, role } = body;
    console.log(body, "Req body");

    if (!staffID || !status || !role) {
      return new Response(JSON.stringify({ message: "All fields are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updatedStaff = await prisma.staff.update({
      where: { staffID },
      data: { status, role },
    });

    return new Response(JSON.stringify(updatedStaff), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error updating staff", error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
