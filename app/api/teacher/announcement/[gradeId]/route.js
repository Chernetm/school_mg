import { getStaffIDFromToken } from '@/utils/auth';
import { prisma } from '@/utils/prisma';

export async function POST(req, { params }) {
  try {
    const { gradeId } = await params;
    const body = await req.json();
    const { title, message, audience } = body;

    const staffID = await getStaffIDFromToken();
    if (!staffID) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    if (!title || !message || !audience) {
      return new Response(JSON.stringify({ error: 'Missing required fields.' }), { status: 400 });
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

    return new Response(JSON.stringify(announcement), { status: 200 });
  } catch (error) {
    console.error('Create Announcement Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create announcement' }), { status: 500 });
  }
}
