"use client"
import { useEffect, useState } from "react";

export default function SemesterManager() {
  const [semesters, setSemesters] = useState([]);
  const [semester, setSemester] = useState("");
  const [status, setStatus] = useState("active");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      const res = await fetch("/api/semester");
      const data = await res.json();
      setSemesters(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching semesters:", error);
      setSemesters([]);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/semester", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ semester: parseInt(semester), status })
    });
    if (res.ok) {
      setMessage("Semester added successfully");
      fetchSemesters();
    }
  };

  const handleDelete = async (id) => {
    await fetch("/api/semester", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    fetchSemesters();
  };

  const handleStatusUpdate = async (id, newStatus) => {
    await fetch("/api/semester", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus })
    });
    fetchSemesters();
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-gray-100 shadow-lg rounded-lg text-gray-800">
      <h2 className="text-xl font-semibold mb-4">Manage Semesters</h2>
      {message && <p className="text-green-600">{message}</p>}
      
      <form onSubmit={handleCreate} className="mb-4">
        <input type="number" placeholder="Semester" value={semester} onChange={(e) => setSemester(e.target.value)} className="w-full p-2 border rounded mb-2 bg-white text-gray-800" required />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 border rounded mb-2 bg-white text-gray-800">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Add Semester</button>
      </form>

      <ul className="space-y-2">
        {semesters.length > 0 ? (
          semesters.map((sem) => (
            <li key={sem.id} className="p-2 border rounded flex justify-between items-center bg-white text-gray-800">
              <span>Semester {sem.semester} - {sem.status}</span>
              <div>
                <button onClick={() => handleStatusUpdate(sem.id, sem.status === "active" ? "inactive" : "active")} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Toggle Status</button>
                <button onClick={() => handleDelete(sem.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-600">No semesters found.</p>
        )}
      </ul>
    </div>
  );
}
