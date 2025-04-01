"use client";
import { useState } from "react";

const StaffAttendance = () => {
  const [role, setRole] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStaff = async () => {
    if (!role) {
      setError("Please select a role.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/attendance/staff?role=${role}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch staff");
      setStaffList(data.staff);
      setAttendance(
        data.staff.reduce((acc, staff) => ({ ...acc, [staff.staffID]: "present" }), {})
      );
    } catch (err) {
      setError(err.message.error);
    } finally {
      setLoading(false);
    }
  };

  const setStaffAttendance = (staffID, status) => {
    setAttendance((prev) => ({ ...prev, [staffID]: status }));
  };

  const submitAttendance = async () => {
    try {
      const response = await fetch("/api/attendance/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attendance }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to submit attendance");
      alert("Attendance submitted successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Staff Attendance</h1>

        {/* Role Selection */}
        <select
          className="border border-gray-300 text-gray-700 p-2 rounded w-full mb-4 focus:ring-blue-500 focus:border-blue-500"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select Role</option>
          <option value="head">Head</option>
          <option value="admin">Admin</option>
          <option value="register">Register</option>
          <option value="staff">Staff</option>
          <option value="teacher">Teacher</option>
        </select>

        {/* Fetch Button */}
        <button
          onClick={fetchStaff}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Loading..." : "Fetch Staff"}
        </button>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {/* Attendance Table */}
        {staffList.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="border border-gray-300  px-4 py-2">Staff Name</th>
                  <th className="border border-gray-300 px-4 py-2">Present</th>
                  <th className="border border-gray-300 px-4 py-2">Absent</th>
                  <th className="border border-gray-300 px-4 py-2">Late</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff) => (
                  <tr key={staff.staffID} className="text-center bg-white hover:bg-gray-50">
                    <td className="border border-gray-300 text-gray-700 px-4 py-2">
                      {`${staff.firstName} ${staff.lastName}`}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        onClick={() => setStaffAttendance(staff.staffID, "present")}
                        className={`p-2 rounded transition ${
                          attendance[staff.staffID] === "present"
                            ? "bg-green-500 text-white"
                            : "bg-gray-300"
                        }`}
                      >
                        ✔
                      </button>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        onClick={() => setStaffAttendance(staff.staffID, "absent")}
                        className={`p-2 rounded transition ${
                          attendance[staff.staffID] === "absent"
                            ? "bg-red-500 text-white"
                            : "bg-gray-300"
                        }`}
                      >
                        ❌
                      </button>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        onClick={() => setStaffAttendance(staff.staffID, "late")}
                        className={`p-2 rounded transition ${
                          attendance[staff.staffID] === "late"
                            ? "bg-yellow-500 text-white"
                            : "bg-gray-300"
                        }`}
                      >
                        ⏳
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Submit Attendance Button */}
        {staffList.length > 0 && (
          <button
            onClick={submitAttendance}
            className="w-full bg-green-600 text-white py-2 mt-4 rounded hover:bg-green-700 transition"
          >
            Submit Attendance
          </button>
        )}
      </div>
    </div>
  );
};

export default StaffAttendance;
