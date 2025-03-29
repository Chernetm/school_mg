"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StaffLogin() {
  const [staffID, setStaffID] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/login/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffID, username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // ✅ Redirect to dashboard after login
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
  <div className="bg-white shadow-md rounded-lg p-8 w-96">
    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Staff Login</h1>
    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
    <form onSubmit={handleLogin} className="space-y-4">
      <input
        type="text"
        placeholder="Staff ID"
        value={staffID}
        onChange={(e) => setStaffID(e.target.value)}
        className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 text-gray-800"
        required
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 text-gray-800"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 text-gray-800"
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  </div>
</div>

  );
}
