// // Sidebar.js
// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { FaBook, FaChalkboardTeacher, FaCog, FaHome, FaSignOutAlt, FaUsers } from "react-icons/fa";

// export default function Sidebar({ onLogout }) {
//   const [active, setActive] = useState("Dashboard");
//   const router = useRouter();

//   const menuItems = [
//     { name: "Dashboard", icon: <FaHome />, route: "/dashboard" },
//     { name: "Teachers", icon: <FaChalkboardTeacher />, route: "/teachers" },
//     { name: "Students", icon: <FaUsers />, route: "/students" },
//     { name: "Courses", icon: <FaBook />, route: "/courses" },
//     { name: "Settings", icon: <FaCog />, route: "/settings" },
//   ];

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <div className="w-64 bg-blue-900 text-white flex flex-col p-4 space-y-4">
//         <h1 className="text-xl font-bold">School Admin</h1>
//         <nav className="flex-1">
//           {menuItems.map((item) => (
//             <button
//               key={item.name}
//               onClick={() => {
//                 setActive(item.name);
//                 router.push(item.route);
//               }}
//               className={`flex items-center gap-3 p-3 rounded-lg w-full text-left ${
//                 active === item.name ? "bg-blue-600" : "hover:bg-blue-700"
//               }`}
//             >
//               {item.icon}
//               {item.name}
//             </button>
//           ))}
//         </nav>
//         <button
//           onClick={onLogout}
//           className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
//         >
//           <FaSignOutAlt /> Logout
//         </button>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-6 bg-gray-100">
//         {/* Dynamic content will go here */}
//       </div>
//     </div>
//   );
// }

// "use client"; tells Next.js this is a Client Component
"use client";

import { useRouter } from "next/router";
import { useState } from "react";
import { FaBook, FaChalkboardTeacher, FaCog, FaHome, FaSignOutAlt, FaUsers } from "react-icons/fa";

export default function Sidebar({ onLogout }) {
  const [active, setActive] = useState("Dashboard");
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, route: "/dashboard" },
    { name: "Teachers", icon: <FaChalkboardTeacher />, route: "/teachers" },
    { name: "Students", icon: <FaUsers />, route: "/students" },
    { name: "Courses", icon: <FaBook />, route: "/courses" },
    { name: "Settings", icon: <FaCog />, route: "/settings" },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white flex flex-col p-4 space-y-4">
        <h1 className="text-xl font-bold">School Admin</h1>
        <nav className="flex-1">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setActive(item.name);
                router.push(item.route);
              }}
              className={`flex items-center gap-3 p-3 rounded-lg w-full text-left ${
                active === item.name ? "bg-blue-600" : "hover:bg-blue-700"
              }`}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </nav>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        {/* Dynamic content will go here */}
      </div>
    </div>
  );
}
