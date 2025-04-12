"use client";

import { useEffect, useState } from "react";

// Subject Management Page
export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");

  // Fetch subjects from API
  useEffect(() => {
    fetch("/api/admin/subject") // ✅ Change to "subjects" (plural)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched subjects:", data); // Debugging
        setSubjects(Array.isArray(data) ? data : []);
      })
      .catch((error) => console.error("Error fetching subjects:", error));
  }, []);
  
  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/admin/subject", { // ✅ Change to "subjects"
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
  
    if (res.ok) {
      const newSubject = await res.json();
      console.log("New Subject:", newSubject); // Debugging
      setSubjects([...subjects, newSubject]);
      setName("");
    } else {
      console.error("Failed to add subject");
    }
  };
  
  const handleDelete = async (id) => {
    const res = await fetch(`/api/admin/subject/${id}`, { // ✅ Change to "subjects"
      method: "DELETE",
    });
  
    if (res.ok) {
      console.log(`Deleted subject with ID: ${id}`); // Debugging
      setSubjects(subjects.filter((subject) => subject.id !== id));
    } else {
      console.error("Failed to delete subject");
    }
  };
  
  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Manage Subjects</h2>

      {/* Register Subject Form */}
      <form onSubmit={handleRegister} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter subject name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full rounded text-black"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </form>

      {/* List of Subjects */}
      {subjects.length === 0 ? (
        <p className="text-gray-900">No subjects available.</p>
      ) : (
        <ul className="space-y-2">
          {Array.isArray(subjects) && subjects.length > 0 ? (
            <ul className="space-y-2">
              {subjects.map((subject) => (
                <li
                  key={subject.id}
                  className="flex justify-between bg-gray-100 p-2 rounded text-black"
                >
                  {subject.name}
                  <button
                    onClick={() => handleDelete(subject.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No subjects available.</p>
          )}
        </ul>
      )}
    </div>
  );
}
