// app/api/payment/callback/route.js
const{prisma} = require('@/utils/prisma');
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const tx_ref = searchParams.get('tx_ref');

  if (!tx_ref) {
    return NextResponse.json({ message: 'Missing tx_ref' }, { status: 400 });
  }

  try {
    const verifyRes = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`
      }
    });

    const result = await verifyRes.json();

    if (result.status !== 'success') {
      return NextResponse.json({ message: 'Payment not verified' }, { status: 400 });
    }

    const metadata = tx_ref.split('-'); // format: fee-{studentID}-{timestamp}
    const studentID = metadata[1];

    const fee = await prisma.fee.findFirst({
      where: {
        studentID,
        status: 'pending'
      },
      orderBy: { paymentDate: 'desc' }
    });

    if (!fee) {
      return NextResponse.json({ message: 'Pending fee not found' }, { status: 404 });
    }

    await prisma.fee.update({
      where: { id: fee.id },
      data: {
        status: 'paid'
      }
    });

    return NextResponse.json({ message: 'Payment confirmed and fee updated' });

  } catch (error) {
    console.error('[CHAPA_CALLBACK_ERROR]', error);
    return NextResponse.json({ message: 'Server error during callback' }, { status: 500 });
  }
}
