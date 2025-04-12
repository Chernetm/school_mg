// filepath: c:\school_mg\app\staff\login\page.jsx
"use client";
import LoginForm from "@/components/LoginForm";
import { useRouter } from "next/navigation";

export default function StaffLogin() {
  const router = useRouter();

  const handleStaffLogin = async (credentials, setError, setLoading) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/login/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      router.push("/staff/teacher_section");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginForm
      title="Staff Login"
      fields={[
        { name: "staffID", type: "text", placeholder: "Staff ID" },
        { name: "username", type: "text", placeholder: "Username" },
        { name: "password", type: "password", placeholder: "Password" },
      ]}
      onSubmit={handleStaffLogin}
    />
  );
}