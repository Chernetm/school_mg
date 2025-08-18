"use client";
import Spinner from "@/components/Loading/Spinner/page";
import { useEffect, useState } from "react";

export default function StaffAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch assignments on component mount
  useEffect(() => {
    fetch("/api/admin/assign")
      .then((res) => res.json())
      .then((data) => setAssignments(data));
  }, []);

  // Optimistic Delete Handler
  const handleDelete = async (staffID) => {
    if (!confirm("Are you sure you want to delete all assignments for this staff member?")) return;

    setLoading(true);

    // Optimistically update UI (remove assignments for this staffID)
    const previousAssignments = assignments;
    setAssignments(assignments.filter((staff) => staff.staffID !== staffID));

    try {
      const response = await fetch("/api/admin/assign", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffID }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
    } catch (error) {
      console.error("Error deleting assignments:", error);
      alert("Failed to delete assignments");

      // Revert state if deletion fails
      setAssignments(previousAssignments);
    } finally {
      setLoading(false);
    }
  };
  if (loading) { 
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }
  

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Staff Assignments</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow-lg bg-white rounded-lg">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border px-6 py-3">First Name</th>
              <th className="border px-6 py-3">Middle Name</th>
              <th className="border px-6 py-3">Last Name</th>
              <th className="border px-6 py-3">Grade</th>
              <th className="border px-6 py-3">Subject</th>
              <th className="border px-6 py-3">Sections</th>
              <th className="border px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((staff, index) => (
              <tr key={staff.staffID} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                <td className="border px-6 py-3 text-gray-700">{staff.firstName}</td>
                <td className="border px-6 py-3 text-gray-700">{staff.middleName}</td>
                <td className="border px-6 py-3 text-gray-700">{staff.lastName}</td>
                <td className="border px-6 py-3 text-gray-700">{staff.grade}</td>
                <td className="border px-6 py-3 text-gray-700">{staff.subject}</td>
                <td className="border px-6 py-3 text-gray-700">
                  {staff.sections.map((s) => s.name).join(", ")}
                </td>
                <td className="border px-6 py-3 text-center">
                  <button
                    onClick={() => handleDelete(staff.staffID)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    disabled={loading}
                  >
                    {loading ? "Deleting..." : "Delete"}
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
