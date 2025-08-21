
"use client";

import { sanitizeInput, validateForm } from "@/utils/formUtils";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEnvelope, FaKey, FaUser } from "react-icons/fa";
import Spinner from "@/components/Loading/Spinner/page";
import Footer from "@/components/Footer";

export default function LoginForm() {
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

  const idField = "staffID";

  const formData = {
    [idField]: sanitizeInput(id),
    email: sanitizeInput(email),
    password: sanitizeInput(password),
  };

  const validationError = validateForm(formData);
  if (validationError) {
    setError(validationError);
    setLoading(false);
    return;
  }

  const res = await signIn("teacher-login", {
    redirect: false,
    ...formData,
  });

  
  if (res.ok) {

    router.push("/teacher");
   
  }
   else {
    if (res.error === "429") {
      setError("Too many login attempts. Please wait 10 minutes.");
    } else {
      setError("Login failed. Please check your credentials.");
    }
    setLoading(false);
  }
};

if(loading) return <Spinner/>

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-800">
          Teacher Login
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="flex items-center border border-gray-300 rounded-lg">
          <FaUser className="text-gray-500 p-2" />
          <input
            type="text"
            value={id}
            onChange={(e) => setId(sanitizeInput(e.target.value))}
            className="w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black rounded-r-lg"
            placeholder={`Enter your Staff ID`}
            required
          />
        </div>

        
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

        <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-700"
          >
            Login
          </button>
      </form>
    </div>
    <Footer/>
    </div>
  );
}
