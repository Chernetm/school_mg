"use client";
import AssignForm from "@/components/Assign"; // Import the AssignForm component
import { useEffect, useState } from "react";
import Spinner from "@/components/Loading/Spinner/page";

export default function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [assigningStaff, setAssigningStaff] = useState(null); // Store staff for assignment
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/teacher/list")
      .then((res) => res.json())
      .then(setStaff);
  }, []);
  if (loading) { 
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }


  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-blue-800">Profile</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-blue-800">Staff ID</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-blue-800">First Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-blue-800">Middle Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-blue-800">Last Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-blue-800">Phone</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-blue-800">Role</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-blue-800">Status</th>
              <th className="px-4 py-2 text-center text-sm font-semibold text-blue-800">Assign</th>
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
                <td className="px-4 py-2 font-mono">{member.staffID}</td>
                <td className="px-4 py-2 text-gray-700">{member.firstName}</td>
                <td className="px-4 py-2 text-gray-700">{member.middleName}</td>
                <td className="px-4 py-2 text-gray-700">{member.lastName}</td>
                <td className="px-4 py-2 text-gray-700">{member.phoneNumber}</td>
                <td className="px-4 py-2 text-gray-700 capitalize">{member.role}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      member.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {member.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
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

