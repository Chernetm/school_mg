"use client";
import { useEffect, useState } from "react";
import AssignForm from "../../../components/Assign"; // Import the AssignForm component

export default function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [updates, setUpdates] = useState({});
  const [assigningStaff, setAssigningStaff] = useState(null); // Store staff for assignment

  useEffect(() => {
    fetch("/api/staff/list")
      .then((res) => res.json())
      .then(setStaff);
  }, []);

  const handleChange = (staffID, field, value) => {
    setUpdates((prev) => ({
      ...prev,
      [staffID]: { ...prev[staffID], [field]: value },
    }));
  };

  const handleUpdate = async (staffID) => {
    const updatedData = updates[staffID];

    if (!updatedData) return;

    await fetch("/api/staff/list", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        staffID,
        role: updatedData.role || staff.find((s) => s.staffID === staffID).role,
        status: updatedData.status || staff.find((s) => s.staffID === staffID).status,
      }),
    });

    setStaff((prev) =>
      prev.map((s) =>
        s.staffID === staffID
          ? { ...s, role: updatedData.role || s.role, status: updatedData.status || s.status }
          : s
      )
    );

    setUpdates((prev) => {
      const newUpdates = { ...prev };
      delete newUpdates[staffID];
      return newUpdates;
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Staff Management</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow-lg bg-white rounded-lg">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border px-6 py-3">Staff ID</th>
              <th className="border px-6 py-3">First Name</th>
              <th className="border px-6 py-3">Last Name</th>
              <th className="border px-6 py-3">Role</th>
              <th className="border px-6 py-3">Status</th>
              <th className="border px-6 py-3">Role</th>
              <th className="border px-6 py-3">Status</th>
              <th className="border px-6 py-3">Actions</th>
              <th className="border px-6 py-3">Assign</th>
              
            </tr>
          </thead>
          <tbody>
            {staff.map((member, index) => (
              <tr
                key={member.staffID}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <td className="border px-6 py-3 text-gray-700">{member.staffID}</td>
                <td className="border px-6 py-3 text-gray-700">{member.firstName}</td>
                <td className="border px-6 py-3 text-gray-700">{member.lastName}</td>
                <td className="border px-6 py-3 text-gray-700">{member.role}</td>
                <td className="border px-6 py-3 text-gray-700">{member.status}</td>
                <td className="border px-6 py-3">
                  <select
                    className="border p-2 rounded bg-gray-200 text-gray-700"
                    value={updates[member.staffID]?.role || member.role}
                    onChange={(e) => handleChange(member.staffID, "role", e.target.value)}
                  >
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher</option>
                    <option value="staff">Staff</option>
                  </select>
                </td>
                <td className="border px-6 py-3">
                  <select
                    className="border p-2 rounded bg-gray-200 text-gray-700"
                    value={updates[member.staffID]?.status || member.status}
                    onChange={(e) => handleChange(member.staffID, "status", e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </td>
                <td className="border px-6 py-3 space-x-2">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    onClick={() => handleUpdate(member.staffID)}
                  >
                    Update
                  </button>
                  
                </td>
                <td className="border px-6 py-3 space-x-2">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    onClick={() => setAssigningStaff(member)}
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assign Section Modal */}
      {assigningStaff && (
        <AssignForm staff={assigningStaff} onClose={() => setAssigningStaff(null)} />
      )}
    </div>
  );
}

