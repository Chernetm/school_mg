"use client";
import AssignForm from "@/components/Assign"; // Import the AssignForm component
import { useEffect, useState } from "react";

export default function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [assigningStaff, setAssigningStaff] = useState(null); // Store staff for assignment

  useEffect(() => {
    fetch("/api/admin/teacher/list")
      .then((res) => res.json())
      .then(setStaff);
  }, []);

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

