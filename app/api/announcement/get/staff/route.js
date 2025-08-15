
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ApiError from '@/lib/api-error';
import { prisma } from '@/utils/prisma';
import { getServerSession } from 'next-auth';






export async function GET() {



  const session = await getServerSession(authOptions);
  console.log("Session data:", session);
  if (!session || !['admin', 'head', 'registrar', 'teacher', 'library'].includes(session.user.role)) {
    throw new ApiError(403, 'Unauthorized access');
  }

  try {
    const announcements = await prisma.announcement.findMany({
      where: {
        audience: 'STAFF',
      },
      orderBy: {
        createdAt: 'desc',
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
    console.error('Fetch ALL Announcements Error:', error);
    return Response.json({ error: 'Failed to fetch announcements' }, { status: 500 });
  }
}
