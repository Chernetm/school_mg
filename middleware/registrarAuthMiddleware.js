import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

// Edge-compatible secret
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret");

export async function registrarAuthMiddleware(req) {
  console.log("🔐 Registrar Authentication Middleware");

  const token = req.cookies.get("staffToken")?.value;

  if (!token) {
    console.warn("❌ No staff token found");
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);

    // ✅ Check if role is 'registrar'
    if (payload.role !== "registrar") {
      console.warn("❌ Access denied. Not a registrar:", payload.role);
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    console.log("✅ Registrar Authenticated:", payload.username || payload.staffID);

    const requestHeaders = new Headers(req.headers);
    if (payload.staffID) requestHeaders.set("x-registrar-id", payload.staffID);
    requestHeaders.set("x-registrar-role", "registrar");

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch (error) {
    console.error("❌ Registrar token verification failed:", error.message);
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
}
