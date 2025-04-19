import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "your_secret_key");

export async function studentAuthMiddleware(req) {
  const token = req.cookies.get("studentToken")?.value;
  
  if (!token) {
    console.warn("❌ No token found - redirecting to login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    const { studentID, role = "student" } = payload;

    // ✅ Only allow access to student-specific routes
    const pathname = new URL(req.url).pathname;
    if (!studentID || role !== "student") {
      console.warn("❌ Invalid student token or role");
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-student-id", studentID);
    requestHeaders.set("x-student-role", role);
    requestHeaders.set("x-student-firstName", payload.firstName || "");
    requestHeaders.set("x-student-middleName", payload.middleName || "");
    requestHeaders.set("x-student-email", payload.email || "");
    requestHeaders.set("x-student-grade", payload.grade )
    requestHeaders.set("x-student-year", payload.year || "");
    requestHeaders.set("x-student-section", payload.section || "");

    console.log("✅ Student Authenticated:", studentID);

    return NextResponse.next({
      request: { headers: requestHeaders },
    });

  } catch (err) {
    console.error("❌ Token verification failed:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
