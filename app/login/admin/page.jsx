
"use client";

import LoginForm from "@/components/LoginForm";
import { useEffect, useState } from "react";
import { MdDesktopMac, MdPhoneIphone } from "react-icons/md";

export default function AdminLoginPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true); // <-- Add loading state

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setLoading(false); // <-- Only finish loading after first check
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // While loading, render nothing
  if (loading) return null;

  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4 bg-gray-100">
        <MdPhoneIphone className="text-red-500 text-6xl mb-4 animate-bounce" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-lg text-gray-600 mb-4">
          Staff login is <span className="text-red-600 font-semibold">not available</span> on mobile devices.
        </p>
        <div className="flex items-center gap-2 text-gray-500">
          <MdDesktopMac className="text-2xl" />
          <span className="text-md">Please switch to a desktop or tablet</span>
        </div>
      </div>
    );
  }

  return <LoginForm type="admin" />;
}
