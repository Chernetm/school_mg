// /app/api/book/list/route.ts
import { prisma } from '@/utils/prisma'; // adjust path as needed
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const books = await prisma.book.findMany();
    return NextResponse.json(books);
  } catch (error) {
    console.error('[BOOK_LIST_ERROR]', error);
    return NextResponse.json(
      { message: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}
