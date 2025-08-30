
import ApiError from '@/lib/api-error';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    const { studentID } = await params;
    console.log("Student ID:", studentID);
    

    if (!studentID) {
        throw new ApiError(400, 'Student ID is required');
    }

    try {

        const student = await prisma.student.findUnique({
            where: { studentID },
            select: {
                studentID: true,
                firstName: true,
                middleName: true,
                lastName: true,
                registrations: {
                    orderBy: { createdAt: 'desc' },
                    select: {
                        grade: true, year: true, section: true,

                    },
                },
            },
        });
        if (!student) {
            throw new ApiError(404, 'Student not found');
        }

        return NextResponse.json(student);
    } catch (error) {
        if (error instanceof ApiError) {
            return NextResponse.json({ message: error.message }, { status: error.statusCode });
        }

        console.error('Server error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}