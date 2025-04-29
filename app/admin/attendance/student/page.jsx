"use client";
import { useState } from "react";

const StudentAttendanceRecord = () => {
  const [grade, setGrade] = useState("");
  const [section, setSection] = useState("");
  const [range, setRange] = useState("weekly");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAttendance = async () => {
    if (!grade || !section) {
      setError("Please enter a grade and section.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/attendance/student?grade=${grade}&section=${section}&range=${range}`
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to fetch attendance");

      if (!data.students || !Array.isArray(data.students)) {
        throw new Error("Invalid data format received");
      }

      setAttendanceData(data.students);
    } catch (error) {
      setError(error.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Student Attendance
        </h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="number"
            placeholder="Enter Grade"
            className="border border-gray-300 p-2 rounded bg-gray-50 text-gray-800"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Section"
            className="border border-gray-300 p-2 rounded bg-gray-50 text-gray-800"
            value={section}
            onChange={(e) => setSection(e.target.value)}
          />
          <select
            className="border border-gray-300 p-2 rounded bg-gray-50 text-gray-800"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="annually">Annually</option>
          </select>
        </div>

        <button
          onClick={fetchAttendance}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Loading..." : "Fetch Attendance"}
        </button>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {/* Attendance Table */}
        {attendanceData.length > 0 ? (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse border bg-white shadow-md">
              <thead>
                <tr className="bg-gray-200 text-gray-800">
                  <th className="border p-2">Student ID</th>
                  <th className="border p-2">First Name</th>
                  <th className="border p-2">Middle Name</th>
                  <th className="border p-2">Present (%)</th>
                  <th className="border p-2">Absent (%)</th>
                  <th className="border p-2">Late (%)</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((student) => (
                  <tr key={student.studentID} className="text-center text-gray-700">
                    <td className="border p-2">{student.studentID}</td>
                    <td className="border p-2">{student.firstName}</td>
                    <td className="border p-2">{student.middleName}</td>
                    <td className="border p-2">{student.presentPercentage.toFixed(2)}%</td>
                    <td className="border p-2">{student.absentPercentage.toFixed(2)}%</td>
                    <td className="border p-2">{student.latePercentage.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading &&
          !error && (
            <p className="text-center text-gray-500 mt-4">No attendance records found.</p>
          )
        )}
      </div>
    </div>
  );
};

export default StudentAttendanceRecord;
