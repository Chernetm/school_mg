// "use client";

// import { StudentServicesDropdown } from "@/components/StudentServicesDropdown";

// export default function StudentLayout({ children }) {
  

//   return (
//     <div className="relative">
  
//       <div className="pt-20 pb-10 px-4">
//         <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Dropdown */}
//           <div className="w-full md:w-auto mx-auto md:mx-0 max-w-sm">
//             <StudentServicesDropdown />
//           </div>
  
//           {/* Content */}
//           <div className="md:col-span-2 space-y-1">
//             {children}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import Navbar from "@/components/Navbar/NavBar";
import { StudentServicesDropdown } from "@/components/StudentServicesDropdown";

// layout.jsx or AdminLayout.jsx
import { UserProvider } from "@/context/UserContext";
import { headers } from "next/headers";

export default async function studentLayout({ children }) {
  const headersList = await headers(); // ✅ await here

  const user = {
    role: headersList.get("x-student-role"),
    grade: headersList.get("x-student-grade"),
  };
  console.log("studentGrade",user.grade)
  return (
    <UserProvider initialUser={user}>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Navbar />
        
        <div className="relative pt-20 pb-10 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Dropdown Section */}
            <div className="w-full md:w-auto mx-auto md:mx-0 max-w-sm">
              <StudentServicesDropdown />
            </div>

            {/* Main Content */}
            <div className="md:col-span-2 space-y-1">
              {children}
            </div>
          </div>
        </div>

      </div>
    </UserProvider>
  );
}
