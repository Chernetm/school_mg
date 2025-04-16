
const {prisma} = require('@/utils/prisma');
import { getStaffIDFromToken } from '@/utils/auth';

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, message, audience, gradeId } = body;
    console.log(gradeId)
    const staffID = await getStaffIDFromToken();
    console.log(staffID,"THe staff token")

    if (!title || !message || !audience) {
      return Response.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        message,
        audience,
        gradeId: audience === 'GRADE' ? Number(gradeId) : null,
        staffID: Number(staffID),
      },
    });

    console.log(announcement)

    return Response.json(announcement, { status: 200 });
  } catch (error) {
   console.error('Create Announcement Error:', error);
    return Response.json({ error: 'Failed to create announcement' }, { status: 500 });
  }
}
