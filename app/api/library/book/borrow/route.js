
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ApiError from '@/lib/api-error';
import {prisma} from '@/utils/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { studentId, bookId, borrowDate, returnDate } = body;
    
    const session = await getServerSession(authOptions);
    console.log("Session data:", session);
    const staffID = session?.user?.staffID;
    
    if (!staffID) {
      throw new ApiError(403, 'Unauthorized access');
    }

    if (!studentId || !bookId || !borrowDate || !returnDate) {
      return Response.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const borrow = await prisma.bookBorrow.create({
      data: {
        borrowDate: new Date(borrowDate),
        returnDate: new Date(returnDate),
        staff: {
          connect: { staffID: staffID }, // Connect the existing staff using staffID
        },
        book: {
          connect: { id: parseInt(bookId) }, // Connect the existing book using bookId
        },
        student: {
          connect: { id: parseInt(studentId) }, // Connect the existing student using studentId
        },
      },
    });

    return Response.json({ message: 'Book borrowed successfully.', borrow }, { status: 201 });
  } catch (error) {
    console.error('Borrow Error:', error);
    return Response.json({ error: 'Failed to borrow book.' }, { status: 500 });
  }
}
