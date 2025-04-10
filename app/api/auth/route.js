// app/api/auth/route.js

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SECRET = process.env.JWT_SECRET || "super-secret";

export async function GET() {
   
  const token = await cookies().get("staffToken")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, SECRET);

    if (decoded.role === "admin") {
      return NextResponse.json({ authenticated: true, role: "admin" });
    }

    return NextResponse.json({ authenticated: false });
  } catch (err) {
    return NextResponse.json({ authenticated: false });
  }
}
