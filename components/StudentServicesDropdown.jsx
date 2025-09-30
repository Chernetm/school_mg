"use client";

import Link from "next/link";
import { useState } from "react";
import useStudentDropdowns from "@/hooks/useStudentDropdowns"; // your hook

export function StudentServicesDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdowns = useStudentDropdowns(); // returns array with translations
  const studentServices = dropdowns[0]; // get the first (and only) dropdown

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 flex items-center justify-between w-full rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
      >
        <span className="font-medium">{studentServices.label}</span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="bg-white shadow-lg rounded-lg w-full mt-2 overflow-hidden">
          {studentServices.items.map((service, index) => (
            <Link
              key={index}
              href={service.href}
              className="flex items-center px-6 py-3 hover:bg-blue-100 transition-colors duration-200 border-b border-gray-100 last:border-0"
              onClick={() => setIsOpen(false)} // ✅ close dropdown on click
            >
              {service.icon && <span className="mr-3">{service.icon}</span>}
              <span>{service.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}


// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import useStudentDropdowns from "@/hooks/useStudentDropdowns"; // your hook

// export function StudentServicesDropdown() {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdowns = useStudentDropdowns(); // returns array with translations
//   const studentServices = dropdowns[0]; // get the first (and only) dropdown

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 flex items-center justify-between w-full rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
//       >
//         <span className="font-medium">{studentServices.label}</span>
//         <svg
//           className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//         </svg>
//       </button>

//       {isOpen && (
//         <div className="bg-white shadow-lg rounded-lg w-full mt-2 overflow-hidden">
//           {studentServices.items.map((service, index) => (
//             <Link
//               key={index}
//               href={service.href}
//               className="flex items-center px-6 py-3 hover:bg-blue-100 transition-colors duration-200 border-b border-gray-100 last:border-0"
//             >
//               {service.icon && <span className="mr-3">{service.icon}</span>}
//               <span>{service.label}</span>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
