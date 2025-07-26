import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function headAuthMiddleware(req) {
  const token = await getToken({ req });
  console.log(token,"token")

  if (!token) {
    return NextResponse.redirect(new URL("/login/admin", req.url));
  }

  const role = token?.role;
  console.log(role,"Role")

  if (role !== "head") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}
