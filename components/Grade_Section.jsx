"use client";

import { useEffect, useState } from "react";

export const GradeSectionList = () => {
  const [gradeSections, setGradeSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch grade sections from API
  useEffect(() => {
    const fetchGradeSections = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/grade_section"); // API to get grade sections
        if (!res.ok) {
          throw new Error("Failed to fetch grade sections");
        }
        const data = await res.json();
        setGradeSections(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGradeSections();
  }, []);

  // Delete grade section by ID
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
  
    try {
      const res = await fetch(`/api/grade_section`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }), // ✅ Send `id` in the request body
      });
  
      if (!res.ok) {
        throw new Error("Failed to delete grade section");
      }
  
      // Remove deleted record from UI
      setGradeSections((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting grade section:", err);
    }
  };
  

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Grade Sections</h2>

      {loading && <p className="text-center text-gray-600">Loading grade sections...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}
      
      {gradeSections.length === 0 && !loading && !error ? (
        <p className="text-center text-gray-500">No grade sections found.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {gradeSections.map(({ id, grade, section }) => (
            <li key={id} className="flex justify-between items-center p-3">
              <div>
                <p className="text-lg font-semibold text-gray-700">Grade: {grade}</p>
                <p className="text-sm text-gray-500">Section: {section}</p>
              </div>
              <button
                onClick={() => handleDelete(id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
