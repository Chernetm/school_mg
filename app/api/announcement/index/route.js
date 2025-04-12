import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
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

    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
}
