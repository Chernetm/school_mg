import { prisma } from "@/utils/prisma"; // Assuming this path points to your prisma instance
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Parse request body (name, email, and message)
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Save the message in the database
    const newMessage = await prisma.message.create({
      data: {
        name,
        email,
        message,
      },
    });

    // Return a success response
    return NextResponse.json({ message: "Message sent successfully", data: newMessage }, { status: 201 });
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
