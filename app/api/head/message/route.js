import { prisma } from "@/utils/prisma"; // Ensure this path is correct
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all messages from the database
    const messages = await prisma.message.findMany({
      orderBy: {
        createdAt: "desc",  // Order by creation date (latest first)
      },
    });

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
