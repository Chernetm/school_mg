"use client";

import { useEffect, useState } from "react";

export default function YearManager() {
  const [years, setYears] = useState([]);
  const [year, setYear] = useState("");
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchYears();
  }, []);

  const fetchYears = async () => {
    const res = await fetch("/api/head/year");
    const data = await res.json();
    setYears(data);
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/head/year", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: parseInt(year), status }),
      });

      if (!res.ok) throw new Error("Failed to create year");

      setYear("");
      fetchYears();
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this year?")) return;

    try {
      await fetch(`/api/head/year/${id}`, { method: "DELETE" });
      fetchYears();
    } catch (error) {
      console.error("Failed to delete year", error);
    }
  };

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Year Manager</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="number"
          placeholder="Enter Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border border-gray-500 p-2 rounded w-40 bg-white text-gray-900 placeholder-gray-600"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-500 p-2 rounded bg-white text-gray-900"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Year"}
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow border border-gray-500">
        <h2 className="text-lg font-semibold mb-3 bg-gray-300 p-2 rounded text-gray-900">
          Years List
        </h2>
        {years.length === 0 ? (
          <p className="text-gray-700">No years added yet.</p>
        ) : (
          <ul>
            {years.map((y) => (
              <li
                key={y.id}
                className="flex justify-between items-center p-2 border-b border-gray-500 bg-gray-100 text-gray-900"
              >
                <span>
                  {y.year} - <span className="text-gray-700">{y.status}</span>
                </span>
                <button
                  onClick={() => handleDelete(y.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
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
}
