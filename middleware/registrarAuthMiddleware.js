import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function registrarAuthMiddleware(req) {
  const token = await getToken({ req });
  console.log(token,"token")

  if (!token) {
    return NextResponse.redirect(new URL("/login/admin", req.url));
  }

  const role = token?.role;
  console.log(role,"Role")

  if (role !== "registrar") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

