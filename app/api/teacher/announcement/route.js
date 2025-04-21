import { prisma } from "@/utils/prisma";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export async function GET(req) {
  try {
    const cookieStore = await Cookies();
    const token = cookieStore.get("studentToken");

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    const gradeId = decoded.grade;
    console.log("Decoded Token:", decoded);
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
