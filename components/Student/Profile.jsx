"use client";
import { useState } from "react";
import { FaCalendarAlt, FaChartBar, FaChevronDown, FaClipboardCheck, FaExclamationTriangle, FaFileAlt, FaIdCard, FaMoneyBillWave, FaSchool, FaUserGraduate } from "react-icons/fa";

export default function StudentDashboard() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const studentData = {
    name: "John Doe",
    id: "STU-123456",
    department: "Computer Science",
    year: "3rd Year",
    email: "john.doe@university.edu",
    phone: "+1 (555) 123-4567",
    advisor: "Dr. Sarah Johnson",
    gpa: "3.75",
    credits: "96/120"
  };

  const services = [
    { name: "Results", icon: <FaChartBar className="mr-3" /> },
    { name: "Registration", icon: <FaFileAlt className="mr-3" /> },
    { name: "Attendance", icon: <FaClipboardCheck className="mr-3" /> },
    { name: "Fees", icon: <FaMoneyBillWave className="mr-3" /> },
    { name: "Discipline", icon: <FaExclamationTriangle className="mr-3" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Main Content */}
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
                    <a 
                      key={index}
                      href="#" 
                      className="flex items-center px-6 py-3 hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100 last:border-0"
                      onClick={() => setActiveTab(service.name.toLowerCase())}
                    >
                      {service.icon}
                      <span>{service.name}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          {/* Left Column - Profile Card */}
          

          {/* Right Column - Services and Content */}
          <div className="md:col-span-2 space-y-6">
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white">
                <h2 className="text-xl font-bold flex items-center">
                  <FaUserGraduate className="mr-2" />
                  Student Profile
                </h2>
              </div>
              <div className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl">
                    {studentData.name.charAt(0)}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FaUserGraduate className="text-blue-500 mr-3" />
                    <span className="font-medium">{studentData.name}</span>
                  </div>
                  <div className="flex items-center">
                    <FaIdCard className="text-blue-500 mr-3" />
                    <span>{studentData.id}</span>
                  </div>
                  <div className="flex items-center">
                    <FaSchool className="text-blue-500 mr-3" />
                    <span>{studentData.department}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-blue-500 mr-3" />
                    <span>{studentData.year}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h3 className="font-semibold text-blue-600 mb-2">Academic Progress</h3>
                  <div className="flex justify-between">
                    <span>GPA:</span>
                    <span className="font-bold">{studentData.gpa}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Credits:</span>
                    <span className="font-bold">{studentData.credits}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
            {/* Services Dropdown */}
            

            {/* Content Area */}
            <div className="bg-white rounded-xl shadow-lg p-6 min-h-[300px] transition-all duration-300">
              {activeTab === "profile" && (
                <div>
                  <h3 className="text-xl font-bold text-blue-700 mb-4">Welcome, {studentData.name}!</h3>
                  <p className="text-gray-600 mb-4">
                    You're currently in your {studentData.year} of {studentData.department}. 
                    Your academic advisor is {studentData.advisor}.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <h4 className="font-semibold text-blue-700 mb-2">Quick Stats</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-blue-600 font-bold text-2xl">{studentData.gpa}</div>
                        <div className="text-gray-500 text-sm">Current GPA</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-blue-600 font-bold text-2xl">{studentData.credits.split('/')[0]}</div>
                        <div className="text-gray-500 text-sm">Completed Credits</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "results" && (
                <div>
                  <h3 className="text-xl font-bold text-blue-700 mb-4">Academic Results</h3>
                  <p className="text-gray-600">Your semester results will appear here.</p>
                </div>
              )}
              
              {/* Add other service content sections similarly */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}