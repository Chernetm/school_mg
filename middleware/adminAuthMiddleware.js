import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function adminAuthMiddleware(req) {
  const token = await getToken({ req });


  if (!token) {
    return NextResponse.redirect(new URL("/login/admin", req.url));
  }

  const role = token?.role;
  

  if (role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}
