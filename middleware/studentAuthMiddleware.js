import { parse } from "cookie";
import { NextResponse } from "next/server";

// Middleware for student authentication
export async function studentAuthMiddleware(req) {
  console.log("🔐 Simple Student Auth Check");

  // Parse cookies from the request headers
  const cookies = parse(req.headers.get("cookie") || "");
  const token = cookies.studentToken;

  console.log("Token:", token);

  // ✅ Check if the student token exists
  if (!token) {
    console.warn("❌ No student token found");
    // Redirect to login page if token is missing
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ Token exists, allow access
  console.log("✅ Token exists, allow access");

  // Proceed to the next handler
  return NextResponse.next();
}
