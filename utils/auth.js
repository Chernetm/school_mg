import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

export async function getStudentIDFromToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("studentToken");

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token.value, SECRET_KEY);
    return decoded.studentID; 
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}

export async function getStudentIDFromExamToken() {
  try {
    const cookieStore = await cookies(); // Use `await cookies()`
    const token = cookieStore.get("examToken"); // Safely get the token
    console.log(token, "examToken");
    if (!token) {
      // If the token is missing, redirect to login page
      return null // Redirect to login page
    }

    const decoded = jwt.verify(token.value, SECRET_KEY); // Decode the token
    return decoded.studentID; // Return studentID
  } catch (error) {
    console.error("Error verifying token:", error);
    
    // If there's an error verifying the token, redirect to login
    return null // Redirect to login page
  }
}

export async function getStaffIDFromToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("staffToken");

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token.value, SECRET_KEY);
    return decoded.staffID; 
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}
