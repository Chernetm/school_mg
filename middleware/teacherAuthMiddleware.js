import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "your_secret_key");

export async function teacherAuthMiddleware(req) {
  const token = req.cookies.get("staffToken")?.value;
 
  if (!token) {
    console.warn("❌ No token found");
    return NextResponse.redirect(new URL("/login/teacher", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);

    if (payload.role !== "teacher") {
      console.warn("❌ Not a teacher user");
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    console.log("✅ Teacher Authenticated:", payload.username);

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", payload.staffID || "");
    requestHeaders.set("x-user-role", "teacher");
    requestHeaders.set("x-user-grade", payload.grade || "");
    requestHeaders.set("x-user-image", payload.image || "");

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch (err) {
    console.error("❌ Token verification failed:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
