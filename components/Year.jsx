"use client";

import { useEffect, useState } from "react";

export default function YearManager() {
  // ✅ Change to default export
  const [years, setYears] = useState([]);
  const [year, setYear] = useState("");
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchYears();
  }, []);

  const fetchYears = async () => {
    const res = await fetch("/api/year");
    const data = await res.json();
    setYears(data);
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/year", {
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
      await fetch(`/api/year/${id}`, { method: "DELETE" });
      fetchYears();
    } catch (error) {
      console.error("Failed to delete year", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Year Manager</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="number"
          placeholder="Enter Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border p-2 rounded w-40 text-black placeholder-gray-500"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded text-black"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Year"}
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-3">Years List</h2>
        {years.length === 0 ? (
          <p>No years added yet.</p>
        ) : (
          <ul>
            {years.map((y) => (
              <li
                key={y.id}
                className="flex justify-between items-center p-2 border-b"
              >
                <span>
                  {y.year} - <span className="text-gray-500">{y.status}</span>
                </span>
                <button
                  onClick={() => handleDelete(y.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
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
