const { prisma } = require('@/utils/prisma');
import { uploadToCloudinary } from "@/utils/cloudinary";
import { sendEmail } from "@/utils/email";
import { hash } from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    console.log("📥 Receiving form data...");
    const formData = await req.formData();

    console.log("✅ Parsing student and parent data...");
    const studentData = JSON.parse(formData.get("student"));
    const parentData = JSON.parse(formData.get("parent"));
    console.log(studentData.studentID);

    if (!studentData.firstName || !studentData.email || !studentData.age || !studentData.grade) {
      console.error("❌ Missing required student fields.");
      return NextResponse.json({ error: "Missing required student fields" }, { status: 400 });
    }

    if ((studentData.grade === "11" || studentData.grade === "12") && !studentData.stream) {
      console.error("❌ Stream is required for grade 11 or 12.");
      return NextResponse.json({ error: "Stream is required for grade 11 or 12." }, { status: 400 });
    }

    console.log("🔐 Generating password...");
    const randomPassword = crypto.randomBytes(5).toString("hex");
    const hashedPassword = await hash(randomPassword, 10);
    const parentPassword = await hash(parentData.firstName, 10);

    console.log("🖼️ Handling image upload...");
    let imageUrl = "";
    const imageFile = formData.get("student.image");

    if (!imageFile) {
      console.error("❌ No image file provided!");
      return NextResponse.json({ error: "Image is required for student registration" }, { status: 400 });
    }
    
    imageUrl = await uploadToCloudinary(imageFile);
    
    console.log("👨‍👩‍👦 Checking if parent exists...");
    let existingParent = await prisma.parent.findUnique({
      where: { email: parentData.email },
    });

    if (!existingParent) {
      console.log("🆕 Creating new parent...");
      existingParent = await prisma.parent.create({
        data: {
          firstName: parentData.firstName,
          lastName: parentData.lastName,
          email: parentData.email,
          phoneNumber: parentData.phoneNumber,
          password: parentPassword,
          address: parentData.address,
        },
      });
    }

    console.log("🎓 Registering new student...");
    const newStudent = await prisma.student.create({
      data: {
        studentID: studentData.studentID,
        firstName: studentData.firstName,
        middleName: studentData.middleName,
        lastName: studentData.lastName,
        age: parseInt(studentData.age),
        phoneNumber: studentData.phoneNumber,
        email: studentData.email,
        password: hashedPassword,
        parentID: existingParent.id,
        image: imageUrl,
      },
    });

    console.log("📜 Creating student registration record...");
    await prisma.registration.create({
      data: {
        studentID: newStudent.studentID,
        stream: studentData.stream || "",
        year: parseInt(studentData.year),
        grade: parseInt(studentData.grade),
        section: studentData.section,
        isActive: true,
      },
    });

    console.log("📧 Sending confirmation email...");
    await sendEmail(studentData.email, "Your Student Account Credentials", `
      <h2>Welcome, ${studentData.firstName}!</h2>
      <p>Your student account has been created successfully.</p>
      <p><strong>Student ID:</strong> ${studentData.studentID}</p>
      <p><strong>Password:</strong> ${randomPassword}</p>
      <p>Please change your password after logging in.</p>
    `);

    console.log("✅ Student registered successfully!");
    return NextResponse.json({ message: "Student registered successfully!", student: newStudent });

  } catch (error) {
    console.error("❌ Registration Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// import { NextResponse } from "next/server";

// import { uploadToCloudinary } from "@/utils/cloudinary";
// import { sendEmail } from "@/utils/email";
// import { hash } from "bcryptjs";
// import crypto from "crypto";

// export async function POST(req) {
//   try {
//     // ✅ Use `req.formData()` to parse form data in Next.js
//     const formData = await req.formData();

//     // ✅ Extract JSON fields
//     const studentData = JSON.parse(formData.get("student"));
//     const parentData = JSON.parse(formData.get("parent"));

//     // ✅ Validate required fields
//     if (!studentData.firstName || !studentData.email || !studentData.age || !studentData.grade) {
//       return NextResponse.json({ error: "Missing required student fields" }, { status: 400 });
//     }

//     // ✅ Ensure stream is provided for grades 11 and 12
//     if ((studentData.grade === "11" || studentData.grade === "12") && !studentData.stream) {
//       return NextResponse.json({ error: "Stream is required for grade 11 or 12." }, { status: 400 });
//     }

//     // ✅ Generate a random password for the student
//     const randomPassword = crypto.randomBytes(5).toString("hex");
//     const hashedPassword = await hash(randomPassword, 10);
//     const parentPassword= await hash(parentData.firstName,10);

//     // ✅ Handle Cloudinary image upload (ONLY SAVE URL)
//     let imageUrl = "";
//     const imageFile = formData.get("student.image"); // Get the image file

//     if (imageFile && imageFile instanceof Blob) {
//       const arrayBuffer = await imageFile.arrayBuffer();
//       const buffer = Buffer.from(arrayBuffer);

//       // ✅ Upload buffer to Cloudinary
//       imageUrl = await uploadToCloudinary(buffer);
//     }

//     // ✅ Check if parent exists
//     let existingParent = await prisma.parent.findUnique({
//       where: { email: parentData.email },
//     });

//     // ✅ If parent does not exist, create a new one
//     if (!existingParent) {
//       existingParent = await prisma.parent.create({
//         data: {
//           firstName: parentData.firstName,
//           lastName: parentData.lastName,
//           email: parentData.email,
//           phoneNumber: parentData.phoneNumber,
//           password:parentPassword,
//           address: parentData.address,
//         },
//       });
//     }
//     const newStudent = await prisma.student.create({
//       data: {
//         studentID: studentData.studentID,
//         firstName: studentData.firstName,
//         middleName: studentData.middleName,
//         lastName: studentData.lastName,
//         age: parseInt(studentData.age),
//         phoneNumber: studentData.phoneNumber,
//         email: studentData.email,
//         password: hashedPassword,
//         parentID: existingParent.id,
//         image: imageUrl, // ✅ Save only the Cloudinary URL
//       },
//     });

//     // ✅ Register student in the Registration table
//     await prisma.registration.create({
//       data: {
//         studentID: studentData.studentID,
//         stream: studentData.stream || "",
//         year: parseInt(studentData.year),
//         grade: parseInt(studentData.grade),
//         section: studentData.section,
//         isActive: true,
//       },
//     });

//     // ✅ Send email with student credentials
//     await sendEmail(studentData.email, "Your Student Account Credentials", `
//       <h2>Welcome, ${studentData.firstName}!</h2>
//       <p>Your student account has been created successfully.</p>
//       <p><strong>Student ID:</strong> ${studentData.studentID}</p>
//       <p><strong>Password:</strong> ${randomPassword}</p>
//       <p>Please change your password after logging in.</p>
//     `);

//     return NextResponse.json({ message: "Student registered successfully!", student: newStudent });
//   } catch (error) {
//     console.error("Registration Error:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
