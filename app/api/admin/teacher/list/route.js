const { prisma } = require("@/utils/prisma");
// pages/api/staff/index.js

export async function GET() {
  
    try {
      const staff = await prisma.staff.findMany({
        where: { role: "teacher" },
        select: {
          id: true,
          staffID: true,
          firstName: true,
          middleName: true,
          lastName: true,
        }
      });
      return Response.json(staff, { status: 201 });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching staff' });
    }
  
}
