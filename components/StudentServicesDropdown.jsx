"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FaChartBar, FaChevronDown, FaClipboardCheck,
  FaExclamationTriangle, FaFileAlt, FaMoneyBillWave, FaPenAlt
} from "react-icons/fa";

const services = [
  { name: "Results", href: "/student/result", icon: <FaChartBar className="mr-3" /> },
  { name: "Registration", href: "/student/registration", icon: <FaFileAlt className="mr-3" /> },
  { name: "Attendance", href: "/student/attendance", icon: <FaClipboardCheck className="mr-3" /> },
  { name: "Fees", href: "/fee", icon: <FaMoneyBillWave className="mr-3" /> },
  { name: "Discipline", href: "/student/discipline", icon: <FaExclamationTriangle className="mr-3" /> },
  { name: "Exam", href: "/student/exam", icon: <FaPenAlt className="mr-3" /> },
  { name: "Exam Result", href: "/student/exam/result", icon: <FaClipboardCheck className="mr-3" /> },
];

export function StudentServicesDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 flex items-center justify-between w-full rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
      >
        <span className="font-medium">Student Services</span>
        <FaChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="bg-white shadow-lg rounded-lg w-full mt-2 overflow-hidden">
          {services.map((service, index) => (
            <Link
              key={index}
              href={service.href}
              className="flex items-center px-6 py-3 hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100 last:border-0"
            >
              {service.icon}
              <span>{service.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
