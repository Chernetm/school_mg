import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ApiError from '@/lib/api-error';
import {prisma} from '@/utils/prisma';
import { getServerSession } from 'next-auth';

import { NextResponse } from "next/server";

export async function GET(req) {
   const session = await getServerSession(authOptions);
    const studentID = session?.user?.studentID;

    if (!studentID) {
      throw new ApiError(403, 'Unauthorized access');
    }

  try {
    const fees = await prisma.fee.findMany({
      where: { studentID },
      orderBy: { month: 'asc' }, // show Jan to Dec
    });

    return NextResponse.json({ fees });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
