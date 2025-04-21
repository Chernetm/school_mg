
"use client";
import LoginForm from "@/components/LoginForm";
import { useRouter } from "next/navigation";
import {
  MdBadge,
  MdLock,
  MdLogin,
  MdPerson
} from "react-icons/md";

export default function StaffLogin() {
  const router = useRouter();
  

  
  const handleStaffLogin = async (credentials, setError, setLoading) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/login/teacher", {
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
        case "staff":
          router.push("/library");
          break;
        default:
          router.push("/unauthorized");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

 
  // Desktop login screen
  return (
    <LoginForm
      title="Teacher Login"
      icon={<MdLogin className="text-5xl text-blue-500 mx-auto mb-4" />}
      fields={[
        {
          name: "staffID",
          type: "number",
          placeholder: "Teacher ID",
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