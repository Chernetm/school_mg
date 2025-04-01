"use client";
import { getDeviceFingerprint } from "@/utils/fingerPrint"; // Import the function
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [deviceFingerprint, setDeviceFingerprint] = useState("");

  useEffect(() => {
    // Get the device fingerprint when the component is mounted
    getDeviceFingerprint().then(setDeviceFingerprint);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/login/exam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, deviceFingerprint }),
    });

    if (res.ok) {
      router.push("/exam/online");
    } else {
      const data = await res.json();
      setError(data.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 text-gray-700 p-2 mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 text-gray-700 p-2 mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded-md hover:bg-blue-600">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
