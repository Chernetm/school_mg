// Assuming Prisma is used for DB operations
const { prisma } = require("@/utils/prisma");
const { sendEmail } = require("@/utils/email");
import { hash } from "bcryptjs";
import { uploadToCloudinary } from "@/utils/cloudinary";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const staffID = formData.get("staffID");
    const firstName = formData.get("firstName");
    const middleName = formData.get("middleName");
    const lastName = formData.get("lastName");
    const phoneNumber = formData.get("phoneNumber");
    const username = formData.get("username");
    const email = formData.get("email");
    const image = formData.get("image"); // optional file

    // ✅ Required fields validation
    if (!staffID || !firstName || !middleName || !lastName || !phoneNumber || !username || !email) {
      return new Response(JSON.stringify({ error: "All required fields must be filled!" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ Check for duplicate staffID
    const staffId = await prisma.staff.findUnique({
      where: { staffID: parseInt(staffID, 10) }
    });
    if (staffId) {
      return new Response(JSON.stringify({ error: "Staff ID already exists!" }), { status: 400 });
    }

    // ✅ Check for duplicate username
    const existingStaff = await prisma.staff.findUnique({
      where: { username }
    });
    if (existingStaff) {
      return new Response(JSON.stringify({ error: "Username already exists!" }), { status: 400 });
    }

    // Temporary password
    const randomPassword = 1234;
    const hashedPassword = await hash(String(randomPassword), 10);

    // ✅ Validate image if provided
    let imageUrl = null;
    if (image) {
      if (image.size > 5 * 1024 * 1024) {
        return new Response(JSON.stringify({ error: "Image size exceeds 5MB" }), { status: 400 });
      }
      if (!["image/jpeg", "image/png", "image/webp"].includes(image.type)) {
        return new Response(JSON.stringify({ error: "Unsupported image format" }), { status: 400 });
      }

      // Upload if provided
      imageUrl = await uploadToCloudinary(image);
      if (!imageUrl) {
        return new Response(JSON.stringify({ error: "Image upload failed" }), { status: 500 });
      }
      console.log("🖼️ Image uploaded successfully!");
    }

    // ✅ Create staff record
    const newStaff = await prisma.staff.create({
      data: {
        staffID: parseInt(staffID, 10),
        firstName,
        middleName,
        lastName,
        phoneNumber,
        username,
        email,
        password: hashedPassword,
        image: imageUrl,
      },
    });

    // ✅ Try sending email, but do not block success if it fails
    try {
      await sendEmail(
        email,
        "Your Staff Account Credentials",
        `
          <h2>Welcome, ${firstName}!</h2>
          <p>Your staff account has been created successfully.</p>
          <p><strong>Username:</strong> ${username}</p>
          <p><strong>Password:</strong> ${randomPassword}</p>
          <p>Please change your password after logging in.</p>
        `
      );
      console.log("📧 Email sent successfully!");
    } catch (emailError) {
      console.warn("⚠️ Email sending failed, but staff registered:", emailError.message);
    }

    return new Response(
      JSON.stringify({ message: "✅ Staff registered successfully!", staff: newStaff }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("❌ Error registering staff:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

