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
        const res = await fetch("/api/admin/grade_section");
        if (!res.ok) throw new Error("Failed to fetch grade sections");

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
      const res = await fetch(`/api/admin/grade_section`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to delete grade section");

      setGradeSections((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting grade section:", err);
    }
  };

  // Group by grade
  const groupedByGrade = gradeSections.reduce((acc, item) => {
    if (!acc[item.grade]) acc[item.grade] = [];
    acc[item.grade].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-6">Grade Sections Overview</h2>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && Object.keys(groupedByGrade).length === 0 && (
        <p className="text-center text-gray-600">No grade sections found.</p>
      )}

      {Object.entries(groupedByGrade).map(([grade, sections]) => (
        <div key={grade} className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Grade {grade}</h3>
          <div className="flex flex-wrap gap-4">
            {sections.map(({ id, section }) => (
              <div key={id} className="flex flex-col bg-white shadow-md rounded-lg p-4 border border-gray-300 min-w-[150px]">
                <p className="font-medium text-gray-800">Section: {section.section}</p>
                <p className="text-sm text-gray-600">Capacity: {section.capacity}</p>
                <button
                  onClick={() => handleDelete(id)}
                  className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
