
"use client";
import LoginForm from "@/components/LoginForm";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MdBadge,
  MdDesktopMac,
  MdLock,
  MdLogin,
  MdPerson,
  MdPhoneIphone,
} from "react-icons/md";

export default function StaffLogin() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleStaffLogin = async (credentials, setError, setLoading) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/login/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      const role = data.staff?.role;

      switch (role) {
        case "teacher":
          router.push("/teacher");
          break;
        case "registrar":
          router.push("/registrar/student");
          break;
        case "admin":
          router.push("/admin/attendance");
          break;
        case "head":
          router.push("/head/announcement");
          break;
        default:
          router.push("/home");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mobile block screen
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

  // Desktop login screen
  return (
    <LoginForm
      title="Staff Login"
      icon={<MdLogin className="text-5xl text-blue-500 mx-auto mb-4" />}
      fields={[
        {
          name: "staffID",
          type: "number",
          placeholder: "Staff ID",
          icon: <MdBadge className="text-gray-400" />,
        },
        {
          name: "username",
          type: "text",
          placeholder: "Username",
          icon: <MdPerson className="text-gray-400" />,
        },
        {
          name: "password",
          type: "password",
          placeholder: "Password",
          icon: <MdLock className="text-gray-400" />,
        },
      ]}
      onSubmit={handleStaffLogin}
    />
  );
}
