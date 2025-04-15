import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

// Edge-compatible secret
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret");

export async function teacherAuthMiddleware(req) {
  console.log("🔐 teacher Authentication Middleware");

  const token = req.cookies.get("staffToken")?.value;

  if (!token) {
    console.warn("❌ No staff token found");
    return NextResponse.redirect(new URL("/login/admin", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);

    // ✅ Check if role is 'teacher'
    if (payload.role !== "teacher") {
      console.warn("❌ Access denied. Not a teacher:", payload.role);
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    console.log("✅ Teacher Authenticated:", payload.username || payload.staffID);

    const requestHeaders = new Headers(req.headers);
    if (payload.staffID) requestHeaders.set("x-teacher-id", payload.staffID);
    requestHeaders.set("x-teacher-role", "teacher");

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch (error) {
    console.error("❌ Teacher token verification failed:", error.message);
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
}
