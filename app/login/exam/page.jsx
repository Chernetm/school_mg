"use client";
import Spinner from "@/components/Loading/Spinner/page";
import LoginForm from "@/components/LoginForm";
import { getDeviceFingerprint } from "@/utils/fingerPrint"; // Import the function
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MdBadge,
  MdLock,
  MdLogin
} from "react-icons/md";

export default function LoginPage() {
  const router = useRouter();
  const [deviceFingerprint, setDeviceFingerprint] = useState("");

  useEffect(() => {
    // Get the device fingerprint when the component is mounted
    getDeviceFingerprint().then(setDeviceFingerprint);
  }, []);

  const handleExamLogin = async (credentials, setError, setLoading) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/login/exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...credentials, deviceFingerprint }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      router.push("/exam");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    
    <LoginForm
          title="Exam Login"
          icon={<MdLogin className="text-5xl text-blue-500 mx-auto mb-4" />}
          fields={[
            {
              name: "studentID",
              type: "text",
              placeholder: "Student ID",
              icon: <MdBadge className="text-gray-400" />,
            },
            ,
            {
              name: "password",
              type: "password",
              placeholder: "Password",
              icon: <MdLock className="text-gray-400" />,
            },
          ]}
          onSubmit={handleExamLogin}
        />
  );
}