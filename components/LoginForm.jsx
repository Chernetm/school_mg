
"use client";
import { getSession } from "next-auth/react";

import { sanitizeInput, validateForm } from "@/utils/formUtils";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEnvelope, FaKey, FaUser } from "react-icons/fa";
import LoadingButton from "./LoadingButton";

export default function LoginForm({ type }) {
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  const provider =
    type === "student"
      ? "student-login"
      : type === "admin"
      ? "admin-login"
      : "teacher-login";

  const idField = type === "student" ? "studentID" : "staffID";

  const formData = {
    [idField]: sanitizeInput(id),
    ...(type !== "student" && { email: sanitizeInput(email) }),
    password: sanitizeInput(password),
  };

  const validationError = validateForm(formData);
  if (validationError) {
    setError(validationError);
    setLoading(false);
    return;
  }

  const res = await signIn(provider, {
    redirect: false,
    ...formData,
  });

  if (res.ok) {
    const session = await getSession();
    const role = session?.user?.role;

    if (type === "student") {
      router.push("/student");
    } else {
      switch (role) {
        case "admin":
          router.push("/admin/announcement");
          break;
        case "head":
          router.push("/head/announcement");
          break;
        case "registrar":
          router.push("/registrar/announcement");
          break;
        case "teacher":
          router.push("/teacher");
          break;
        case "library":
          router.push("/library");
          break;
        default:
          router.push("/announcement");
      }
    }
  } else {
    if (res.error === "429") {
      setError("Too many login attempts. Please wait 10 minutes.");
    } else {
      setError("Login failed. Please check your credentials.");
    }
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-800">
          {type === "student"
            ? "Student Login"
            : type === "admin"
            ? "Admin Login"
            : "Teacher Login"}
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="flex items-center border border-gray-300 rounded-lg">
          <FaUser className="text-gray-500 p-2" />
          <input
            type="text"
            value={id}
            onChange={(e) => setId(sanitizeInput(e.target.value))}
            className="w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black rounded-r-lg"
            placeholder={`Enter your ${
              type === "student" ? "Student ID" : "Staff ID"
            }`}
            required
          />
        </div>

        {type !== "student" && (
          <div className="flex items-center border border-gray-300 rounded-lg">
            <FaEnvelope className="text-gray-500 p-2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(sanitizeInput(e.target.value))}
              className="w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black rounded-r-lg"
              placeholder="Enter your email"
              required
            />
          </div>
        )}

        <div className="flex items-center border border-gray-300 rounded-lg">
          <FaKey className="text-gray-500 p-2" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(sanitizeInput(e.target.value))}
            className="w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black rounded-r-lg"
            placeholder="Enter your password"
            required
          />
        </div>

        <LoadingButton
          loading={loading}
          text="Login"
          loadingText="Logging in..."
        />
      </form>
    </div>
  );
}
