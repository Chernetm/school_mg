

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaChartBar, FaChevronDown, FaClipboardCheck,
  FaExclamationTriangle, FaFileAlt, FaMoneyBillWave, FaPenAlt
} from "react-icons/fa";

export default function StudentDashboard() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStudentData() {
      try {
        const response = await fetch("/api/student/profile");
        if (!response.ok) {
          throw new Error("Failed to fetch student data");
        }
        const data = await response.json();
        setStudentData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStudentData();
  }, []);

  if (loading) {
    return <div className="text-center mt-20">Loading student data...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-600">Error: {error}</div>;
  }

  const services = [
    { name: "Results", href:"/student/attendance", icon: <FaChartBar className="mr-3" /> },
    { name: "Registration", href:"/student/attendance",icon: <FaFileAlt className="mr-3" /> },
    { name: "Attendance", href:"/student/attendance",icon: <FaClipboardCheck className="mr-3" /> },
    { name: "Fees", href:"/student/attendance",icon: <FaMoneyBillWave className="mr-3" /> },
    { name: "Discipline",href:"/student/attendance", icon: <FaExclamationTriangle className="mr-3" /> },
    { name: "Exam", href:"/exam/takeExam",icon: <FaPenAlt className="mr-3" /> },
    { name: "Exam Result",href:"/exam/result/student", icon: <FaClipboardCheck className="mr-3" /> },
  ];

  return (
    <div className="relative">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 -z-10"></div>

      <div className="pt-20 pb-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 flex items-center justify-between w-full rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <span className="font-medium">Student Services</span>
              <FaChevronDown className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isDropdownOpen && (
              <div className="bg-white shadow-lg rounded-lg w-full mt-2 overflow-hidden transition-all duration-300">
                {services.map((service, index) => (
                  <Link
                    key={index}
                    href={service.href}
                    className="flex items-center px-6 py-3 hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100 last:border-0"
                    onClick={() => setActiveTab(service.name.toLowerCase())}
                  >
                    {service.icon}
                    <span>{service.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-center mb-4">
                    {studentData.image ? (
                      <img src={studentData.image} alt="Student" className="w-24 h-24 rounded-full object-cover" />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl">
                        {studentData.firstName.charAt(0)}
                      </div>
                    )}
                  </div>

              <h2 className="text-xl font-bold text-center">{studentData.firstName} {studentData.middleName}</h2>
              <p className="text-center text-gray-600">{studentData.email}</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Student ID:</span>
                  <span>{studentData.studentID}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Grade:</span>
                  <span>{studentData.registrations[0]?.grade || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Section:</span>
                  <span>{studentData.registrations[0]?.section || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Year:</span>
                  <span>{studentData.registrations[0]?.year || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              {activeTab === "profile" && (
                <div>
                  <h3 className="text-xl font-bold text-blue-700 mb-4">Welcome, {studentData.firstName}!</h3>
                  <p className="text-gray-600 mb-4">Here is your latest academic information.</p>
                </div>
              )}

              {activeTab === "results" && (
                <div>
                  <h3 className="text-xl font-bold text-blue-700 mb-4">Academic Results</h3>
                  <p className="text-gray-600">Your semester results will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}