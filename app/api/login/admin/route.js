const { prisma } = require("@/utils/prisma");
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    console.log("🔹 Received POST request to /api/login/admin");

    // Parse request body
    const { staffID, username, password } = await req.json();
    console.log("🔹 Request body received");

    if (!staffID || !username || !password) {
      console.log("❌ Missing required fields");
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // 🔹 Fetch staff from the database
    console.log(`🔹 Searching for staff: ${username}`);
    const staff = await prisma.staff.findUnique({
      where: {staffID: Number(staffID), username:username, status: "active" },
      select: {
        id: true,
        staffID: true,
        firstName: true,
        lastName: true,
        username: true,
        password: true,
        role: true,
        image:true,
        email:true,
      },
    });
    
    if(!staff) {
      console.log("❌ Staff not found");
      return NextResponse.json({ message: "Staff not found" }, { status: 404 });
    }

    if (!staff || staff.role == 'teacher') {
      return NextResponse.json(
        { message: 'Access denied. Admin only.' },
        { status: 403 }
      );
    }

    

    // 🔹 Verify password
    console.log("🔹 Comparing passwords...");
    const passwordMatch = await bcrypt.compare(password, staff.password);
    if (!passwordMatch) {
      console.log("❌ Password mismatch");
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }
    // 🔹 Generate JWT token
    console.log("🔹 Generating JWT token...");
    const token = jwt.sign(
      {
        id: staff.id,
        staffID:staff.staffID,
        username: staff.username,
        role: staff.role,
        image: staff.image,
        email: staff.email,
        
        firstName: staff.firstName,
        middleName: staff.middleName,
        lastName: staff.lastName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🔹 Set authentication cookie
    console.log("🔹 Setting authentication cookie...");
    const response = NextResponse.json({
      message: "Login successful",
      staff: {
        id: staff.id,
        staffID:staff.staffID,
        username: staff.username,
        role: staff.role,
        
      },
    });

    // response.headers.set(
    //   "Set-Cookie",
    //   serialize("staffToken", token, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production",
    //     sameSite: "strict",
    //     path: "/",
    //     maxAge: 7 * 24 * 60 * 60, // 7 days
    //   })
    // );
    response.cookies.set("staffToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    console.log("🔹 Authentication cookie set");    
    console.log("✅ Login successful!");
    return response;
  } catch (error) {
    console.error("❌ Internal Server Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
