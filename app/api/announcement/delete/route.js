const{prisma} = require('@/utils/prisma');

export async function DELETE(req, { params }) {
    const { id } = params;
  
    try {
      await prisma.announcement.delete({ where: { id } });
      return Response.json({ message: 'Deleted' }, { status: 200 });
    } catch (error) {
      console.error(error);
      return Response.json({ error: 'Delete failed' }, { status: 500 });
    }
  }
  