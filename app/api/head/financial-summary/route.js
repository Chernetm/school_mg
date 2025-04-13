const { prisma } = require('@/utils/prisma');
import { NextResponse } from 'next/server';

const gradeFees = {
  9: 1000,
  10: 1100,
  11: 1200,
  12: 1300,
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const grade = parseInt(searchParams.get('grade'), 10);
  const month = searchParams.get('month');
  const year = parseInt(searchParams.get('year'), 10);

  if (!grade || !month || !year) {
    return NextResponse.json({ message: 'Missing query parameters' }, { status: 400 });
  }

  try {
    // 1. Get active registrations
    const totalActiveStudents = await prisma.registration.count({
      where: {
        grade,
        year,
        isActive: true,
      },
    });

    // 2. Get fee records
    const fees = await prisma.fee.findMany({
      where: {
        grade,
        month,
        year,
        status: 'paid',
      },
    });

    const paidCount = fees.length;
    const unpaidCount = totalActiveStudents - paidCount;

    const totalExpected = (gradeFees[grade] || 0) * totalActiveStudents;
    const totalPaid = fees.reduce((sum, fee) => sum + (fee.amountPaid || 0), 0);

    return NextResponse.json({
      grade,
      month,
      year,
      paidCount,
      unpaidCount,
      totalExpected,
      totalPaid,
      totalActiveStudents,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
