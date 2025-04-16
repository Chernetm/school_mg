'use client';

import Link from "next/link";
import { useState } from "react";
import {
  FaChartBar, FaChevronDown, FaClipboardCheck,
  FaExclamationTriangle, FaFileAlt, FaMoneyBillWave, FaPenAlt
} from "react-icons/fa";

export default function StudentLayout({ children }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  const services = [
    { name: "Results", href: "/student/result", icon: <FaChartBar className="mr-2" /> },
    { name: "Registration", href: "/student/registration", icon: <FaFileAlt className="mr-2" /> },
    { name: "Attendance", href: "/student/attendance", icon: <FaClipboardCheck className="mr-2" /> },
    { name: "Fees", href: "/student/fee", icon: <FaMoneyBillWave className="mr-2" /> },
    { name: "Discipline", href: "/student/discipline", icon: <FaExclamationTriangle className="mr-2" /> },
    { name: "Exam", href: "/student/exam", icon: <FaPenAlt className="mr-2" /> },
    { name: "Exam Result", href: "/exam/result", icon: <FaClipboardCheck className="mr-2" /> },
  ];


    return (
      <div className="min-h-screen bg-blue-50">
        {/* Top Navigation Bar */}
        <header className="bg-white shadow-md fixed w-full z-20 top-0 left-0 px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-700">Student Portal</h1>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
            >
              <span>Services</span>
              <FaChevronDown className={`ml-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white shadow-lg rounded-md overflow-hidden z-30">
                {services.map((service, index) => (
                  <Link
                    key={index}
                    href={service.href}
                    className="flex items-center px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {service.icon}
                    {service.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-24 px-4 pb-10 max-w-6xl mx-auto">
          {children}
        </main>
      </div>
    );
  }
