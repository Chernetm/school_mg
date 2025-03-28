import { v2 as cloudinaryV2 } from "cloudinary";
import fs from "fs/promises";
import os from "os"; // Import os for temp directory
import path from "path";

// Configure Cloudinary
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (file) => {
  try {
    console.log("📤 Preparing file for Cloudinary upload...");

    // Get a valid temp directory for the current OS
    const tempDir = os.tmpdir();
    const tempPath = path.join(tempDir, file.name);

    console.log(`📂 Saving file temporarily at: ${tempPath}`);

    // Convert the file to a buffer and save it
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(tempPath, buffer);

    console.log("🚀 Uploading file to Cloudinary...");

    // Upload the file to Cloudinary
    const result = await cloudinaryV2.uploader.upload(tempPath, {
      folder: "admin_profiles",
    });

    console.log("✅ Cloudinary Upload Success:", result.secure_url);

    // Delete the temporary file after upload
    await fs.unlink(tempPath);
    console.log("🗑️ Temporary file deleted.");

    return result.secure_url; // Return Cloudinary URL
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);
    throw new Error("Failed to upload image to Cloudinary.");
  }
};
