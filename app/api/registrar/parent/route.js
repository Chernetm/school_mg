const { prisma } = require("@/utils/prisma");
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const parents = await prisma.parent.findMany();
    return NextResponse.json(parents);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch parents" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { firstName, lastName, email, password, phoneNumber, address } = await req.json();
    console.log(firstName,lastName,email,password,phoneNumber,address)

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);

    await prisma.parent.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phoneNumber,
        address,
      },
    });

    return NextResponse.json({ success: "Parent registered successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error registering parent" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { id, firstName, lastName, email, password, phoneNumber, address } = await req.json();
     console.log(id,firstName,lastName,email,password,phoneNumber,address)
    if (!id) {
      return NextResponse.json({ error: "Parent ID is required" }, { status: 400 });
    }

    const existingParent = await prisma.parent.findUnique({
      where: { id: Number(id)},
    });
    console.log(existingParent)

    if (!existingParent) {
      return NextResponse.json({ error: "Parent not found" }, { status: 404 });
    }

    let updatedData = { firstName, lastName, email, phoneNumber, address };
    
    if (password) {
      updatedData.password = await hash(password, 10);
    }

    await prisma.parent.update({
      where: { id:Number(id) },
      data: updatedData,
    });

    return NextResponse.json({ success: "Parent information updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error updating parent information" }, { status: 500 });
  }
}

