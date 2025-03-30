"use client";

import { useEffect, useState } from "react";

export const GradeSectionList = () => {
  const [gradeSections, setGradeSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGradeSections = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/grade_section");
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      const res = await fetch(`/api/grade_section`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete grade section");
      }

      setGradeSections((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting grade section:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-200 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-4 bg-gray-300 p-3 rounded">
        Grade Sections
      </h2>

      {loading && <p className="text-center text-gray-700">Loading grade sections...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      <div className="bg-white p-4 rounded shadow border border-gray-400">
        {gradeSections.length === 0 && !loading && !error ? (
          <p className="text-center text-gray-600">No grade sections found.</p>
        ) : (
          <ul className="divide-y divide-gray-400">
            {gradeSections.map(({ id, grade, section }) => (
              <li key={id} className="flex justify-between items-center p-3 bg-gray-100 border border-gray-400 rounded mb-2">
                <div>
                  <p className="text-lg font-semibold text-gray-900">Grade: {grade}</p>
                  <p className="text-sm text-gray-700">Section: {section}</p>
                </div>
                <button
                  onClick={() => handleDelete(id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
