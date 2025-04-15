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
  
      const data = await res.json();
     

      if (!res.ok) {
        throw new Error(data.message);
      }
  
      // 👇 Get the role from the returned staff object
      const role = data.staff?.role;
  
      // ✅ Redirect based on role
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