"use client";
import Spinner from "@/components/Loading/Spinner/page";
import { useEffect, useState } from "react";

export default function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [updates, setUpdates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch staff data
        const res = await fetch("/api/head/admin");
        if (!res.ok) {
          throw new Error("Failed to fetch staff data");
        }
        const data = await res.json();
        setStaff(data);
      } catch (error) {
        console.error("Error fetching staff data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  const handleChange = (staffID, field, value) => {
    setUpdates((prev) => ({
      ...prev,
      [staffID]: { ...prev[staffID], [field]: value },
    }));
  };

  const handleUpdate = async (staffID) => {
    const updatedData = updates[staffID];

    if (!updatedData) return;

    await fetch("/api/head/admin", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        staffID,
        role: updatedData.role || staff.find((s) => s.staffID === staffID).role,
        status:
          updatedData.status || staff.find((s) => s.staffID === staffID).status,
      }),
    });

    setStaff((prev) =>
      prev.map((s) =>
        s.staffID === staffID
          ? {
              ...s,
              role: updatedData.role || s.role,
              status: updatedData.status || s.status,
            }
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
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">Profile</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">Staff ID</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-blue-800">First Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-blue-800">Last Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-blue-800">Role</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-blue-800">Status</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-blue-800">Update Role</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-blue-800">Update Status</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-blue-800">Actions</th>
            </tr>
          </thead>

          <tbody>
            {staff.map((member, index) => (
              <tr
                key={member.staffID}
                className={`border-t ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-50`}
              >
                <td className="px-4 py-2 text-center">
                  <img
                    src={member.image || "/default-avatar.png"}
                    alt="Staff"
                    className="w-10 h-10 rounded-full object-cover mx-auto"
                  />
                </td>

                <td className="px-4 py-2 font-mono text-gray-700">{member.staffID}</td>
                <td className="px-4 py-2 text-gray-700">{member.firstName}</td>
                <td className="px-4 py-2 text-gray-700">{member.lastName}</td>
                <td className="px-4 py-2 text-gray-700">{member.role}</td>

                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {member.status}
                  </span>
                </td>

                <td className="px-4 py-2">
                  <select
                    className="border p-2 rounded bg-gray-200 text-gray-700 text-sm"
                    value={updates[member.staffID]?.role || member.role}
                    onChange={(e) => handleChange(member.staffID, 'role', e.target.value)}
                  >
                    <option value="head">Head</option>
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher</option>
                    <option value="registrar">Registrar</option>
                    <option value="library">Library</option>
                    <option value="staff">Staff</option>
                  </select>
                </td>

                <td className="px-4 py-2">
                  <select
                    className="border p-2 rounded bg-gray-200 text-gray-700 text-sm"
                    value={updates[member.staffID]?.status || member.status}
                    onChange={(e) => handleChange(member.staffID, 'status', e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </td>

                <td className="px-4 py-2 space-x-2">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    onClick={() => handleUpdate(member.staffID)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
