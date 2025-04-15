import { serialize } from "cookie";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    console.log("🔸 Received logout request");

    // Clear the cookie by setting it to expire in the past
    const response = NextResponse.json({ message: "Logout successful" });

    response.headers.set(
      "Set-Cookie",
      serialize("staffToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: new Date(0), // Expire the cookie immediately
      })
    );

    console.log("✅ Token removed, user logged out");
    return response;
  } catch (error) {
    console.error("❌ Error during logout:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
