"use client";

import { Dashboard } from "@/components/Dashboard";
import { Navbar } from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }) {
  const [isAdmin, setIsAdmin] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth", { credentials: "include" });
        const data = await res.json();
        setIsAdmin(data.authenticated && data.role === "admin");
      } catch {
        setIsAdmin(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAdmin === false) {
      router.push("/login/admin");
    }
  }, [isAdmin]);

  if (isAdmin === null) return <div className="p-10">Checking auth...</div>;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar stays fixed */}
      <div className="w-64 fixed h-full bg-gray-900 z-50">
        <Dashboard />
      </div>

      <div className="flex-1 ml-64 bg-gray-100 min-h-screen">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

