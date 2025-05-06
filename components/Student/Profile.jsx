
"use client";
import { useEffect, useState } from "react";
import { FaGraduationCap, FaUser } from "react-icons/fa"; // import icons

export default function StudentDashboard() {
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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-4">
      <div className="bg-white rounded-xl shadow-lg p-4 w-full max-w-md md:max-w-2xl">
        {/* Student Info */}
        <div className="flex flex-col items-center mb-6">
          {studentData.image ? (
            <img
              src={studentData.image}
              alt="Student"
              className="w-20 h-20 rounded-full object-cover mb-4"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl mb-4">
              {studentData.firstName.charAt(0)}
            </div>
          )}

          <h2 className="text-xl font-bold text-gray-800">
            {studentData.firstName} {studentData.lastName}
          </h2>
          <p className="text-gray-600 text-sm">{studentData.email}</p>

          <div className="mt-4 space-y-2 w-full">
            <div className="flex justify-between text-gray-700 text-sm">
              <span className="font-medium">Student ID:</span>
              <span>{studentData.studentID}</span>
            </div>
            <div className="flex justify-between text-gray-700 text-sm">
              <span className="font-medium">Grade:</span>
              <span>{studentData.grade || "N/A"}</span>
            </div>
            <div className="flex justify-between text-gray-700 text-sm">
              <span className="font-medium">Section:</span>
              <span>{studentData.section || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-4 space-x-4">
          <button
            className={`flex items-center space-x-2 text-lg font-medium ${
              activeTab === "profile" ? "text-blue-600" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <FaUser className="text-xl" /> <span>Profile</span>
          </button>
          <button
            className={`flex items-center space-x-2 text-lg font-medium ${
              activeTab === "results" ? "text-blue-600" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("results")}
          >
            <FaGraduationCap className="text-xl" /> <span>Results</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <div>
            <h3 className="text-lg font-bold text-blue-700 mb-4">
              Welcome, {studentData.firstName}!
            </h3>
            <p className="text-gray-600 mb-4 text-sm">Here is your latest academic information.</p>
          </div>
        )}

        {activeTab === "results" && (
          <div>
            <h3 className="text-lg font-bold text-blue-700 mb-4">Academic Results</h3>
            <p className="text-gray-600 text-sm">Your semester results will appear here.</p>
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <h4 className="font-semibold">Your Exam Results</h4>
              {/* Example of exam result */}
              <p className="text-sm">You have completed 2 exams with the following results:</p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Math Exam - Grade: A</li>
                <li>Science Exam - Grade: B+</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
