// "use client";
// import {
//   Bell,
//   ChevronDown,
//   ChevronUp,
//   Home
// } from "lucide-react";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import dropdowns from "./DropdownLink";


// export const Dashboard = () => {
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [role, setRole] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const toggleDropdown = (label) => {
//     setOpenDropdown((prev) => (prev === label ? null : label));
//   };

//   useEffect(() => {
//     const fetchRole = async () => {
//       try {
//         const res = await fetch("/api/auth", { credentials: "include" });
//         const data = await res.json();
//         setRole(data.user.role);
//       } catch {
//         setRole(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRole();
//   }, []);

//   if (loading) {
//     return <div className="text-white p-4">Loading...</div>;
//   }

//   return (
//     <div className="h-screen w-64 bg-gray-900 text-white flex flex-col p-4 shadow-lg relative">
//       <h2 className="text-2xl font-bold text-center mb-6">Admin Panel</h2>

//       <nav className="flex-1 flex flex-col justify-center">
//         <ul className="space-y-2">
//           <NavItem href="/" icon={<Home />} label="Dashboard" />

//           {dropdowns
//             .filter((dropdown) => dropdown.roles.includes(role))
//             .map((dropdown) => (
//               <DropdownNav
//                 key={dropdown.label}
//                 label={dropdown.label}
//                 icon={dropdown.icon}
//                 items={dropdown.items}
//                 isOpen={openDropdown === dropdown.label}
//                 onToggle={() => toggleDropdown(dropdown.label)}
//               />
//             ))}

//           <NavItem href="/notifications" icon={<Bell />} label="Notifications" />
//         </ul>
//       </nav>
//     </div>
//   );
// };

// const NavItem = ({ href, icon, label }) => (
//   <li className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200">
//     {icon}
//     <Link href={href} className="text-lg">
//       {label}
//     </Link>
//   </li>
// );

// const DropdownNav = ({ label, icon, items, isOpen, onToggle }) => (
//   <li>
//     <button
//       onClick={onToggle}
//       className="flex justify-between items-center w-full px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200"
//     >
//       <span className="flex items-center space-x-3">
//         {icon}
//         <span className="text-lg">{label}</span>
//       </span>
//       {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//     </button>

//     {isOpen && (
//       <ul className="ml-8 mt-1 space-y-1">
//         {items.map((item, index) => (
//           <li key={index}>
//             <Link
//               href={item.href}
//               className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200"
//             >
//               {item.label}
//             </Link>
//           </li>
//         ))}
//       </ul>
//     )}
//   </li>
// );

"use client";

import { useUser } from "@/context/UserContext";
import {
  Bell,
  ChevronDown,
  ChevronUp,
  Home
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import dropdowns from "./DropdownLink";

export const Dashboard = () => {
  const role = useUser()?.user?.role;

  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (label) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col p-4 shadow-lg relative">
      <h2 className="text-2xl font-bold text-center mb-6">Admin Panel</h2>

      <nav className="flex-1 flex flex-col justify-center">
        <ul className="space-y-2">
          <NavItem href="/" icon={<Home />} label="Dashboard" />

          {dropdowns
            .filter((dropdown) => dropdown.roles.includes(role))
            .map((dropdown) => (
              <DropdownNav
                key={dropdown.label}
                label={dropdown.label}
                icon={dropdown.icon}
                items={dropdown.items}
                isOpen={openDropdown === dropdown.label}
                onToggle={() => toggleDropdown(dropdown.label)}
              />
            ))}

          <NavItem href="/notifications" icon={<Bell />} label="Notifications" />
        </ul>
      </nav>
    </div>
  );
};

const NavItem = ({ href, icon, label }) => (
  <li className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200">
    {icon}
    <Link href={href} className="text-lg">
      {label}
    </Link>
  </li>
);

const DropdownNav = ({ label, icon, items, isOpen, onToggle }) => (
  <li>
    <button
      onClick={onToggle}
      className="flex justify-between items-center w-full px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200"
    >
      <span className="flex items-center space-x-3">
        {icon}
        <span className="text-lg">{label}</span>
      </span>
      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
    </button>

    {isOpen && (
      <ul className="ml-8 mt-1 space-y-1">
        {items.map((item, index) => (
          <li key={index}>
            <Link
              href={item.href}
              className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    )}
  </li>
);
