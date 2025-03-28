 // Assuming Prisma is used for DB operations
const { prisma } = require("@/utils/prisma");
const { sendEmail } =require("@/utils/email"); // ✅ Import email function
import { hash } from "bcryptjs";
import crypto from "crypto";

import { uploadToCloudinary } from "@/utils/cloudinary"; // Adjust the import if needed
export async function POST(req) {
    try {
      const formData = await req.formData(); // ✅ Use formData for file uploads
      const staffID = formData.get("staffID");
      const firstName = formData.get("firstName");
      const middleName=formData.get("middleName");
      const lastName = formData.get("lastName");
      const phoneNumber = formData.get("phoneNumber");
      const username = formData.get("username");
      const email = formData.get("email");
      const role = formData.get("role");
      const image = formData.get("image"); // File upload (optional)
  
      // Validate required fields
      if (!staffID || !firstName || !middleName || !lastName || !phoneNumber || !username || !email || !role) {
        return new Response(JSON.stringify({ error: "All required fields must be filled!" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const existingStaff = await prisma.staff.findUnique({
        where: { email }
      });
  
      if (existingStaff) {
        return new Response(JSON.stringify({ error: "Email already exists!" }), { status: 400 });
      }
  
      const randomPassword = crypto.randomBytes(5).toString("hex");

      // ✅ Hash the password before saving
      const hashedPassword = await hash(randomPassword, 10);
  
  
      // Upload image if provided
      let imageUrl = null;
      if (image && image instanceof File) {
        imageUrl = await uploadToCloudinary(image);
      }
  
      // Create staff in the database
      const newStaff = await prisma.staff.create({
        data: {
          staffID: parseInt(staffID, 10), // Convert to number
          firstName,
          middleName,
          lastName,
          phoneNumber,
          username,
          email,
          password: hashedPassword,
          role,
          image: imageUrl,
        },
      });
       await sendEmail(email, "Your Staff Account Credentials", `
        <h2>Welcome, ${firstName}!</h2>
        <p>Your staff account has been created successfully.</p>
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>Password:</strong> ${randomPassword}</p>
        <p>Please change your password after logging in.</p>
      `);
  
      return new Response(JSON.stringify({ message: "✅ Staff registered successfully!", staff: newStaff }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
  
    } catch (error) {
      console.error("❌ Error registering staff:", error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  


// export async function POST(req) {
//   try {
//     const formData = await req.formData();
//     const staffID = formData.get("staffID");
//     const firstName = formData.get("firstName");
//     const middleName = formData.get("middleName") || null;
//     const lastName = formData.get("lastName");
//     const phoneNumber = formData.get("phoneNumber");
//     const username = formData.get("username");
//     const email = formData.get("email");
//     const role = formData.get("role");
//     const image = formData.get("image");

//     if (!staffID || !firstName || !lastName || !phoneNumber || !username || !email || !role) {
//       return new Response(JSON.stringify({ error: "All required fields must be filled!" }), {
//         status: 400,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     // ✅ Generate a random 10-character password
//     const randomPassword = crypto.randomBytes(5).toString("hex");

//     // ✅ Hash the password before saving
//     const hashedPassword = await hash(randomPassword, 10);

//     // Upload image if provided
//     let imageUrl = null;
//     if (image && image instanceof File) {
//       imageUrl = await uploadToCloudinary(image);
//     }

//     // ✅ Save staff data in the database
//     const newStaff = await prisma.staff.create({
//       data: {
//         staffID: parseInt(staffID, 10),
//         firstName,
//         middleName,
//         lastName,
//         phoneNumber,
//         username,
//         email,
//         password: hashedPassword, // Save the hashed password
//         role,
//         image: imageUrl,
//       },
//     });

//     // ✅ Send email with the generated password
//     await sendEmail(email, "Your Staff Account Credentials", `
//       <h2>Welcome, ${firstName}!</h2>
//       <p>Your staff account has been created successfully.</p>
//       <p><strong>Username:</strong> ${username}</p>
//       <p><strong>Password:</strong> ${randomPassword}</p>
//       <p>Please change your password after logging in.</p>
//     `);

//     return new Response(JSON.stringify({ message: "✅ Staff registered successfully!", staff: newStaff }), {
//       status: 201,
//       headers: { "Content-Type": "application/json" },
//     });

//   } catch (error) {
//     console.error("❌ Error registering staff:", error);
//     return new Response(JSON.stringify({ error: "Internal Server Error" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }
