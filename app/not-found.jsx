// app/not-found.jsx
'use client';

export default function NotFound() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 via-red-200 to-red-300 px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-extrabold text-red-600 drop-shadow-lg">
          Page Not Found 404
        </h1>
        <p className="mt-6 text-xl md:text-2xl font-semibold text-red-800">
          Sorry, we couldn’t find the page you were looking for.
        </p>
        <p className="mt-2 text-base text-red-700 max-w-md">
          It may have been removed, renamed, or does not exist.
        </p>
        <a
          href="/"
          className="mt-8 inline-block px-6 py-3 bg-white text-red-600 font-semibold text-lg rounded-full shadow-md hover:bg-red-100 transition duration-300"
        >
          Return to Homepage
        </a>
        <div>
        <footer className="absolute bottom-5 text-sm text-red-700/80">
          &copy; {new Date().getFullYear()} School Website. All rights reserved.
        </footer>

        </div>
        
      </div>
    );
  }
  



  
  // import Navbar from "@/components/Navbar/NavBar";
  // import { StudentServicesDropdown } from "@/components/StudentServicesDropdown";
  
  // // layout.jsx or AdminLayout.jsx
  // import { UserProvider } from "@/context/UserContext";
  // import { headers } from "next/headers";
  
  // export default async function studentLayout({ children }) {
  //   const headersList = await headers(); // ✅ await here
  
  //   const user = {
  //     role: headersList.get("x-student-role"),
  //     // You can grab other header values similarly
  //   };
  //   console.log("User role from headers:", user.role);
  
  //   return (
  //     <UserProvider initialUser={user}>
  //       <div className="min-h-screen flex flex-col bg-gray-100">
  //   <Navbar />
  //   <div className="flex flex-1">
  //     <StudentServicesDropdown className="w-64 bg-white shadow-md" />
  
  //     <main className="flex-1 p-6 mt-10">
  //       {children}
  //     </main>
  //   </div>
  // </div>
  
  //     </UserProvider>
  //   );
  // }