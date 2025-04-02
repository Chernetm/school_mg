"use client";
import { useState } from "react";
import {
  FaBars, FaChevronDown
} from "react-icons/fa";

export default function StudentDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="h-screen bg-gray-100">
      {/* Top Navbar */}
      <header className="bg-blue-700 text-white p-4 flex justify-between items-center fixed w-full top-0 z-50">
        <h2 className="text-xl font-bold">School Portal</h2>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden">
          <FaBars size={24} />
        </button>
      </header>

      <div className="pt-16 flex flex-col items-center">
        {/* Dropdown Menu */}
        <div className="relative w-full max-w-sm px-4">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-blue-700 text-white px-4 py-2 flex items-center justify-between w-full rounded-lg"
          >
            <span>Student Services</span>
            <FaChevronDown />
          </button>

          {/* Dropdown List */}
          {isDropdownOpen && (
            <div className="bg-white shadow-lg rounded-lg w-full mt-2 transition-all duration-300">
              <a href="#" className="block px-4 py-2 hover:bg-gray-200">Results</a>
              <a href="#" className="block px-4 py-2 hover:bg-gray-200">Registration</a>
              <a href="#" className="block px-4 py-2 hover:bg-gray-200">Attendance</a>
              <a href="#" className="block px-4 py-2 hover:bg-gray-200">Fees</a>
              <a href="#" className="block px-4 py-2 hover:bg-gray-200">Discipline</a>
            </div>
          )}
        </div>

        {/* Profile Card (Moves Down When Dropdown Expands) */}
        <div className={`bg-white p-6 rounded-xl shadow-lg w-full max-w-sm mx-auto mt-${isDropdownOpen ? "6" : "4"} transition-all duration-300`}>
          <h3 className="text-lg font-semibold text-blue-700">My Profile</h3>
          <p><strong>Full Name:</strong> John Doe</p>
          <p><strong>ID No:</strong> 123456</p>
          <p><strong>Department:</strong> Computer Science</p>
          <p><strong>Year:</strong> 3rd</p>
        </div>
      </div>
    </div>
  );
}
