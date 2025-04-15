// "use client";

// import { Dashboard } from "@/components/Dashboard";
// import { Navbar } from "@/components/Navbar/NavBar";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function AdminLayout({ children }) {
//   const [isAdmin, setIsAdmin] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await fetch("/api/auth", { credentials: "include" });
//         const data = await res.json();
//         setIsAdmin(data.authenticated && data.user.role === "admin");
//       } catch {
//         setIsAdmin(false);
//       }
//     };
//     checkAuth();
//   }, []);

//   useEffect(() => {
//     if (isAdmin === false) {
//       router.push("/login/admin");
//     }
//   }, [isAdmin]);

//   if (isAdmin === null) return <div className="p-10">Checking authentication...</div>;

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-100">
//       {/* Navbar at the top */}
//       <Navbar />

//       {/* Sidebar + Main Content */}
//       <div className="flex flex-1">
//         {/* Sidebar on the left */}
//         <aside className="w-64 bg-gray-900 text-white fixed h-full z-40">
//           <Dashboard />
//         </aside>

//         {/* Main content with left margin to account for sidebar */}
//         <main className="flex-1 ml-64 p-6 mt-10">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

'use client';

import { Dashboard } from "@/components/Dashboard";
import { Navbar } from "@/components/Navbar/NavBar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }) {
  const [isAdmin, setIsAdmin] = useState(null); // null = loading
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth", { credentials: "include" });
        const data = await res.json();

        if (data.authenticated && data.user?.role === "admin") {
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
        {/* Navbar at the top */}
        <Navbar />

        {/* Sidebar + Main Content */}
        <div className="flex flex-1">
          {/* Sidebar on the left */}
          <aside className="w-64 bg-gray-900 text-white fixed h-full z-40">
            <Dashboard />
          </aside>

          {/* Main content with left margin to account for sidebar */}
          <main className="flex-1 ml-64 p-6 mt-10">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return null; // Fallback in case isAdmin becomes false while waiting for redirect
}
