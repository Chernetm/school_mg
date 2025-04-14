// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

// const SECRET = process.env.JWT_SECRET || "super-secret";

// export async function GET() {
//   const cookieStore = await cookies(); // 👈 Await this first!
//   const token = cookieStore.get("staffToken")?.value;

  
//   if (!token) {
//     return NextResponse.json({ authenticated: false });
//   }

//   try {
//     const decoded = jwt.verify(token, SECRET);
//     console.log(decoded.role,"Role")

//     return NextResponse.json({
//       authenticated: true,
//       role: decoded.role || null,
//     });
//   } catch (err) {
//     return NextResponse.json({ authenticated: false });
//   }
// }

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SECRET = process.env.JWT_SECRET || "super-secret";

export async function GET() {
  const cookieStore = await cookies(); // no need to await
  const token = cookieStore.get("staffToken")?.value;

  if (!token) {
    return NextResponse.json({
      authenticated: false,
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET);

    return NextResponse.json({
      authenticated: true,
      user: {
        id: decoded.id || null,
        staffID: decoded.staffID || null,
        username: decoded.username || null,
        email: decoded.email || null,
        role: decoded.role || null,
        image: decoded.image || null,
        assignments: decoded.assignments || [],
      },
    });
  } catch (err) {
    console.error("JWT verification error:", err);
    return NextResponse.json({
      authenticated: false,
      message: "Invalid or expired token",
    });
  }
}
