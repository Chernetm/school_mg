"use client"
import Spinner from "@/components/Loading/Spinner/page";
import { useEffect, useState } from "react";

const StaffAttendancePage = () => {
  const [role, setRole] = useState("");
  const [range, setRange] = useState("weekly");
  const [staffAttendance, setStaffAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch attendance when role and range are selected
    const fetchAttendance = async () => {
      if (!role) {
        return; // Don't fetch if role is not selected
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/head/attendance?role=${role}&range=${range}`
        );
        const data = await response.json();

        if (data.staff) {
          setStaffAttendance(data.staff);
        } else {
          setError("No attendance records found.");
        }
      } catch (error) {
        setError("Error fetching attendance data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [role, range]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 shadow-lg rounded-xl mt-10">
      <h1 className="text-3xl font-semibold text-gray-800 text-center mb-6">Staff Attendance</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <select
          className="border border-gray-300 p-2 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select Role</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
          <option value="head">Head</option>
        </select>

        <select
          className="border border-gray-300 p-2 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500"
          value={range}
          onChange={(e) => setRange(e.target.value)}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="annually">Annually</option>
        </select>
      </div>

      {loading && <p className="text-center text-blue-500">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Attendance Table */}
      {staffAttendance.length > 0 && (
        <div className="mt-6 overflow-x-auto bg-white rounded-md shadow-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="border p-3 text-left text-gray-700">StaffID</th>
                <th className="border p-3 text-left text-gray-700">FirstName</th>
                <th className="border p-3 text-left text-gray-700">MiddleName</th>
                <th className="border p-3 text-left text-gray-700">LastName</th>
                <th className="border p-3 text-left text-gray-700">Present (%)</th>
                <th className="border p-3 text-left text-gray-700">Absent (%)</th>
                <th className="border p-3 text-left text-gray-700">Late (%)</th>
              </tr>
            </thead>
            <tbody>
              {staffAttendance.map((staff) => (
                <tr key={staff.staffID} className="text-center">
                  <td className="border p-3 text-gray-700">{staff.staffID}</td>
                  <td className="border p-3 text-gray-700">{staff.firstName}</td>
                  <td className="border p-3 text-gray-700">{staff.middleName}</td>
                  <td className="border p-3 text-gray-700">{staff.lastName}</td>
                  <td className="border p-3 text-green-500">{staff.presentPercentage.toFixed(2)}%</td>
                  <td className="border p-3 text-red-500">{staff.absentPercentage.toFixed(2)}%</td>
                  <td className="border p-3 text-yellow-500">{staff.latePercentage.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {staffAttendance.length === 0 && !loading && !error && (
        <p className="text-center text-gray-500 mt-4">No attendance records found.</p>
      )}
    </div>
  );
};

export default StaffAttendancePage;