
const {prisma} = require('@/utils/prisma');
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, message, audience, gradeId } = body;

    if (!title || !message || !audience) {
      return Response.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        message,
        audience,
        gradeId: audience === 'GRADE' ? gradeId : null,
      },
    });

    return Response.json(announcement, { status: 200 });
  } catch (error) {
    console.error('Create Announcement Error:', error);
    return Response.json({ error: 'Failed to create announcement' }, { status: 500 });
  }
}
