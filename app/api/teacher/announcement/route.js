import { prisma } from "@/utils/prisma";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export async function GET(req) {
  try {
    const gradeId= req.headers.get("x-user-grade");
    console.log("Grade from headers:", gradeId);

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
