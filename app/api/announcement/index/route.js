const{prisma}=require("@/utils/prisma")
import { NextResponse } from 'next/server';


export default async function GET(req, res) {
  const { role, gradeId } = req.query;

  try {
    const announcements = await prisma.announcement.findMany({
      where: {
        OR: [
          { audience: 'ALL' },
          { audience: role },
          ...(role === 'STUDENTS' && gradeId
            ? [{ audience: 'GRADE', gradeId }]
            : []),
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    NextResponse(200).json(announcements);
  } catch (error) {
    NextResponse(500).json({ error: 'Failed to fetch announcements' });
  }
}
