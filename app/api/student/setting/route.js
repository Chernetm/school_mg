import { getStudentIDFromToken } from '@/utils/auth';
import { prisma } from '@/utils/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, phoneNumber, password, currentPassword } = body;
    const  studentID = await getStudentIDFromToken();
    console.log(studentID)
    if (!studentID) {
      return NextResponse.json({ message: 'Student ID is required.' }, { status: 400 });
    }
    

    if (!currentPassword) {
      return NextResponse.json({ message: 'Current password is required.' }, { status: 400 });
    }

    const existingStaff = await prisma.student.findUnique({
      where: { studentID },
    });

    if (!existingStaff) {
      return NextResponse.json({ message: 'Student not found.' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, existingStaff.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Incorrect current password.' }, { status: 401 });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const updatedData = {
      ...(email && { email }),
      ...(phoneNumber && { phoneNumber }),
      ...(hashedPassword && { password: hashedPassword }),
    };

    await prisma.student.update({
      where: { studentID },
      data: updatedData,
    });

    return NextResponse.json({ message: 'Settings updated successfully!' }, { status: 200 });
  } catch (error) {
    console.error('[SETTINGS_UPDATE_ERROR]', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
