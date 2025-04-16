"use client";
import { useEffect, useState } from "react";

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
    <div className="relative">
      <div className="pt-4 pb-10 px-4"> {/* Reduced top padding */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
              <div className="flex justify-center mb-4">
                {studentData.image ? (
                  <img src={studentData.image} alt="Student" className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl">
                    {studentData.firstName.charAt(0)}
                  </div>
                )}
              </div>

              <h2 className="text-xl font-bold text-center">
                {studentData.firstName} {studentData.middleName}
              </h2>
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
                  <h3 className="text-xl font-bold text-blue-700 mb-4">
                    Welcome, {studentData.firstName}!
                  </h3>
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
