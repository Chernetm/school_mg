import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SECRET = process.env.JWT_SECRET || "super-secret";

export async function GET() {
  const cookieStore = await cookies(); // 👈 Await this first!
  const token = cookieStore.get("studentToken")?.value;

  
  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, SECRET);

    return NextResponse.json({
      authenticated: true,
    });
  } catch (err) {
    return NextResponse.json({ authenticated: false });
  }
}