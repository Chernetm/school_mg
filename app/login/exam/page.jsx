"use client";
import LoginForm from "@/components/LoginForm";
import { getDeviceFingerprint } from "@/utils/fingerPrint"; // Import the function
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

      router.push("/student/exam");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginForm
      title="Exam Login"
      fields={[
        { name: "email", type: "email", placeholder: "Email" },
        { name: "password", type: "password", placeholder: "Password" },
      ]}
      onSubmit={handleExamLogin}
    />
  );
}