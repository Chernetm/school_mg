'use client';

import { Navbar } from "@/components/Navbar/NavBar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TeacherLayout({ children }) {
  const [isAdmin, setIsAdmin] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth", { credentials: "include" });
        const data = await res.json();

        if (data.authenticated && data.user?.role === "teacher") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch {
        setIsAdmin(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isAdmin === false) {
      router.push("/");
    }
  }, [isAdmin, router]);

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Checking admin access...
      </div>
    );
  }

  if (isAdmin === true) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        {/* Navbar on top */}
        <Navbar />

        {/* Main content area (full width, responsive) */}
        <div className="flex-1 flex flex-col md:flex-row mt-16">
          {/* Optional Sidebar - hidden on small screens */}
          {/* <aside className="hidden md:block w-64 bg-white border-r shadow-sm"></aside> */}

          {/* Main Content (takes full width) */}
          <main className="flex-1 p-4">{children}</main>
        </div>
      </div>
    );
  }

  return null;
}
