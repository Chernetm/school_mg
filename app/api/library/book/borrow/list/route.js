// /app/api/book/borrowed/route.ts
import { prisma } from '@/utils/prisma'; // adjust path as needed
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const borrowedBooks = await prisma.bookBorrow.findMany({
        include: {
          book: true,
          student: {
            select: {
              studentID: true,
              firstName: true,
              lastName: true,
              registrations: {  // Include registration to fetch grade
                select: {
                  grade: true,  // Select the grade from the registration
                  section: true // Select section if it exists in Registration model
                }
              }
            }
          }
        }
      });
      
     console.log("Borrowed Books Data:", borrowedBooks);
    return NextResponse.json(borrowedBooks);
  } catch (error) {
    console.error('[BORROWED_BOOKS_ERROR]', error);
    return NextResponse.json(
      { message: 'Failed to fetch borrowed books' },
      { status: 500 }
    );
  }
}
