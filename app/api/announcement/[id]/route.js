

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ApiError from '@/lib/api-error';
import {prisma} from '@/utils/prisma';
import { getServerSession } from 'next-auth';
   
export async function DELETE(req, { params }) {

    const { id } = params;
    const session = await getServerSession(authOptions);

    if (!session  || !['admin', 'head', 'registrar', 'teacher', 'library'].includes(session.user.role)) {
      throw new ApiError(403, 'Unauthorized access');
    }
  
    try {
      await prisma.announcement.delete({ where: {id: Number(id) } });
      return Response.json({ message: 'Deleted' }, { status: 200 });
    } catch (error) {
      console.error(error);
      return Response.json({ error: 'Delete failed' }, { status: 500 });
    }
  }
  