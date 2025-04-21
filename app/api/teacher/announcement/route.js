import { prisma } from "@/utils/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
// import { getStaffIDFromToken } from "@/utils/auth";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export async function GET(req) {
  try {
    const cookieStore = await cookies();
        const token = cookieStore.get("staffToken");
    
        if (!token) {
          return null;
        }
    
    const decoded = jwt.verify(token.value, SECRET_KEY);
    const gradeId= decoded.grade;
    console.log("Decoded Token:", decoded);
    console.log("Grade ID from Token:", gradeId);
    if(!gradeId){
      return Response.json({ error: "Grade ID not found" }, { status: 400 });
    }
    
    console.log("Grade ID:", gradeId);

    const announcements = await prisma.announcement.findMany({
      where: {
        audience: "GRADE",
        gradeId: Number(gradeId),
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        staff: {
          select: {
            firstName: true,
            lastName: true,
            image: true,
          },
        },
      },
    });

    return Response.json(announcements, { status: 200 });
  } catch (error) {
    console.error("Fetch Announcements Error:", error);
    return Response.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}
