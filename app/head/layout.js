// 'use client';

// import { Dashboard } from "@/components/Dashboard";
// import { Navbar } from "@/components/Navbar/NavBar";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function AdminLayout({ children }) {
//   const [isHeadAdmin, setIsHeadAdmin] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await fetch("/api/auth", { credentials: "include" });
//         const data = await res.json();

//         if (data.authenticated && data.user?.role === "head") {
//           setIsHeadAdmin(true);
//         } else {
//           setIsHeadAdmin(false);
//         }
//       } catch {
//         setIsHeadAdmin(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   useEffect(() => {
//     if (isHeadAdmin === false) {
//       router.push("/login/admin");
//     }
//   }, [isHeadAdmin, router]);

//   if (isHeadAdmin === null) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
//         Checking head admin access...
//       </div>
//     );
//   }

//   if (isHeadAdmin === true) {
//     return (
//       <div className="min-h-screen flex flex-col bg-gray-100">
//         {/* Navbar at the top */}
//         <Navbar />

//         {/* Sidebar + Main Content */}
//         <div className="flex flex-1">
//           {/* Sidebar on the left */}
//           <aside className="w-64 bg-gray-900 text-white fixed h-full z-40">
//             <Dashboard />
//           </aside>

//           {/* Main content with left margin to account for sidebar */}
//           <main className="flex-1 ml-64 p-6 mt-10">
//             {children}
//           </main>
//         </div>
//       </div>
//     );
//   }

//   return null; // Nothing is shown after redirect
// }




// 'use client';

// import { Dashboard } from "@/components/Dashboard";
// import { Navbar } from "@/components/Navbar/NavBar";

// export default function AdminLayout({ children }) {
//   return (
//     <div className="min-h-screen flex flex-col bg-gray-100">
//       <Navbar />
//       <div className="flex flex-1">
//         <aside className="w-64 bg-gray-900 text-white fixed h-full z-40">
//           <Dashboard />
//         </aside>
//         <main className="flex-1 ml-64 p-6 mt-10">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }


// // app/admin/layout.jsx (or wherever your Admin layout is)
// import { Dashboard } from "@/components/Dashboard";
// import { Navbar } from "@/components/Navbar/NavBar";
// import { RoleProvider } from "@/context/RoleContext";
// import { headers } from "next/headers";

// export default function AdminLayout({ children }) {
//   const headersList = headers();
//   const role = headersList.get("x-user-role") || null;

//   return (
//     <RoleProvider initialRole={role}>
//       <div className="min-h-screen flex flex-col bg-gray-100">
//         <Navbar />
//         <div className="flex flex-1">
//           <aside className="w-64 bg-gray-900 text-white fixed h-full z-40">
//             <Dashboard />
//           </aside>
//           <main className="flex-1 ml-64 p-6 mt-10">
//             {children}
//           </main>
//         </div>
//       </div>
//     </RoleProvider>
//   );
// }


// layout.jsx or AdminLayout.jsx
import { Dashboard } from "@/components/Dashboard";
import { Navbar } from "@/components/Navbar/NavBar";
import { UserProvider } from "@/context/UserContext";
import { headers } from "next/headers";

export default async function headLayout({ children }) {
  const headersList = await headers(); // ✅ await here

  const user = {
    role: headersList.get("x-user-role"),
    // You can grab other header values similarly
  };

  return (
    <UserProvider initialUser={user}>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Navbar />
        <div className="flex flex-1">
          <aside className="w-64 bg-gray-900 text-white fixed h-full z-40">
            <Dashboard />
          </aside>
          <main className="flex-1 ml-64 p-6 mt-10">
            {children}
          </main>
        </div>
      </div>
    </UserProvider>
  );
}
