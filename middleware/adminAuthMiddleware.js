import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

// Edge-compatible secret
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret");

export async function adminAuthMiddleware(req) {
  console.log("🔐 Admin Authentication Middleware");

  const token = req.cookies.get("staffToken")?.value;

  if (!token) {
    console.warn("❌ No staff token found");
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);

    // ✅ Check if role is 'admin'
    if (payload.role !== "admin") {
      console.warn("❌ Access denied. Not an admin:", payload.role);
      return NextResponse.redirect(new URL("/unauthorized", req.url)); // Optional: Your access denied page
    }

    console.log("✅ Admin Authenticated:", payload.username || payload.staffID);

    // Forward user info in headers (optional for SSR/api use)
    const requestHeaders = new Headers(req.headers);
    if (payload.staffID) requestHeaders.set("x-admin-id", payload.staffID);
    requestHeaders.set("x-admin-role", "admin");

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch (error) {
    console.error("❌ Admin token verification failed:", error.message);
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
}
