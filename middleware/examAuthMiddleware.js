import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "your_secret_key");

export async function examAuthMiddleware(req) {
  const token = req.cookies.get("examToken")?.value;
  
  if (!token) {
    console.warn("❌ No token found");
    return NextResponse.redirect(new URL("/login/exam", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-student-id", payload.staffID);
   
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch (err) {
    console.error("❌ Token verification failed:", err);
    return NextResponse.redirect(new URL("/login/exam", req.url));
  }
}
