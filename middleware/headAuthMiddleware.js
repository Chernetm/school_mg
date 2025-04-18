// import { parse } from "cookie";
// import { jwtVerify } from "jose";
// import { NextResponse } from "next/server";

// const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "your_secret_key");

// export async function headAuthMiddleware(req) {
//   console.log("🔐 Head Role Authentication");

//   const cookies = parse(req.headers.get("cookie") || "");
//   const token = cookies.staffToken;

//   if (!token) {
//     console.warn("❌ No head token found");
//     return NextResponse.redirect(new URL("/head/login", req.url));
//   }

//   try {
//     const { payload } = await jwtVerify(token, SECRET_KEY);

//     if (payload.role !== "head") {
//       console.warn("❌ Not a head user");
//       return NextResponse.redirect(new URL("/unauthorized", req.url));
//     }

//     console.log("✅ Head Authenticated:", payload.username);

//     const requestHeaders = new Headers(req.headers);
//     requestHeaders.set("x-head-id", payload.headID || "");
//     requestHeaders.set("x-head-role", "head");

//     return NextResponse.next({
//       request: { headers: requestHeaders },
//     });
//   } catch (error) {
//     console.error("❌ Token verification failed:", error);
//     return NextResponse.redirect(new URL("/head/login", req.url));
//   }
// }

// middleware.js

// middleware.js


import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "your_secret_key");

export async function headAuthMiddleware(req) {
  const token = req.cookies.get("staffToken")?.value;
  console.log("🔐 Head Role Authentication", token);

  if (!token) {
    console.warn("❌ No token found");
    return NextResponse.redirect(new URL("/login/admin", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);

    if (payload.role !== "head") {
      console.warn("❌ Not a head user");
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    console.log("✅ Head Authenticated:", payload.username);

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", payload.staffID || "");
    requestHeaders.set("x-user-role", "head");
    requestHeaders.set("x-user-image", payload.image || "");

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch (err) {
    console.error("❌ Token verification failed:", err);
    return NextResponse.redirect(new URL("/login/admin", req.url));
  }
}
