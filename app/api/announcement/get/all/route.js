const { prisma } = require('@/utils/prisma'); 

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      where: {
        audience: 'ALL',
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        staff: {
          select: {
            firstName: true,
            middleName: true,
            image: true,
          },
        },
      },
    });

    return Response.json(announcements, { status: 200 });
  } catch (error) {
    console.error('Fetch ALL Announcements Error:', error);
    return Response.json({ error: 'Failed to fetch announcements' }, { status: 500 });
  }
}
