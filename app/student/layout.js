"use client";

import { StudentServicesDropdown } from "@/components/StudentServicesDropdown";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StudentLayout({ children }) {
  const [isStudent, setIsStudent] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/student", { credentials: "include" });
        const data = await res.json();

        if (data.authenticated) {
          setIsStudent(true);
        } else {
          setIsStudent(false);
        }
      } catch {
        setIsStudent(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isStudent === false) {
      router.push("/");
    }
  }, [isStudent, router]);

  if (isStudent === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Checking student access...
      </div>
    );
  }

  if (isStudent === true) {
   
    
  }
  return (
    <div className="relative">
  
      <div className="pt-20 pb-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dropdown */}
          <div className="w-full md:w-auto mx-auto md:mx-0 max-w-sm">
            <StudentServicesDropdown />
          </div>
  
          {/* Content */}
          <div className="md:col-span-2 space-y-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
  
  return null;
}
