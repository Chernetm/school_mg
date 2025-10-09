const {prisma} = require('@/utils/prisma');
import { NextResponse } from 'next/server';

// Hardcoded grade fee map (same as frontend)
const gradeFees = {
  9: 1000,
  10: 1100,
  11: 1200,
  12: 1300,
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { studentID, firstName, month } = body;

    const currentYear = new Date().getFullYear();

    // ✅ Step 1: Validate student and get latest active registration
    const registration = await prisma.registration.findFirst({
      where: {
        studentID: studentID,
        isActive: true
      },
      include: {
        student: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (
      !registration ||
      registration.student.firstName !== firstName
    ) {
      return NextResponse.json({ message: 'Student not found or mismatch' }, { status: 404 });
    }

    const grade = registration.grade;
    const amount = gradeFees[grade] || 0;

    if (amount === 0) {
      return NextResponse.json({ message: 'Invalid grade or no fee set' }, { status: 400 });
    }

    // ✅ Step 2: Check existing fee
    const existingFee = await prisma.fee.findUnique({
      where: {
        studentID_month_year: {
          studentID,
          month,
          year: currentYear
        }
      }
    });

    if (existingFee?.status === 'paid') {
      return NextResponse.json({ message: 'Fee already paid for this month' }, { status: 400 });
    }

    // ✅ Step 3: Initialize Chapa payment
    const txRef = `fee-${studentID}-${Date.now()}`;
    const chapaRes = await fetch('https://api.chapa.co/v1/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'ETB',
        email: registration.student.email || 'student@example.com',
        first_name: firstName,
        tx_ref: txRef,
        callback_url: process.env.CHAPA_CALLBACK_URL,
        return_url: `https://southwestacademy.vercel.app/payment-success?tx_ref=${txRef}`,
        customization: {
          title: 'Monthly Fee',
          description: `${month} fee for Grade ${grade}`
        }
      })
    });

    const data = await chapaRes.json();
    console.log('[CHAPA_RESPONSE]', data);


    if (data.status !== 'success') {
      return NextResponse.json({ message: 'Chapa initialization failed', data }, { status: 500 });
    }

    // ✅ Step 4: Save pending fee
    await prisma.fee.upsert({
      where: {
        studentID_month_year: {
          studentID,
          month,
          year: currentYear
        }
      },
      update: {
        status: 'pending',
        amountPaid: amount,
        paymentDate: new Date()
      },
      create: {
        studentID,
        month,
        grade,
        year: currentYear,
        status: 'pending',
        amountPaid: amount
      }
    });

    return NextResponse.json({ link: data.data.checkout_url });

  } catch (err) {
    console.error('[CHAPA_INITIATE_ERROR]', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
