import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function studentAuthMiddleware(req) {
  const token = await getToken({ req });
  

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = token?.role;
  

  if (role !== "student") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}
