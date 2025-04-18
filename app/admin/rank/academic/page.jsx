"use client";
import { useState } from "react";

export default function RankSemesterThree() {
  const [year, setYear] = useState("");
  const [grade, setGrade] = useState("");
  const [section, setSection] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleRank = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/status-rank-average/semester", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ year, grade, section }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to rank students");

      setMessage({ type: "success", text: data.message });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Generate Semester 3 Rankings</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Academic Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g. 2025"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Grade</label>
          <input
            type="number"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g. 10"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Section</label>
          <input
            type="text"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g. A"
          />
        </div>

        <button
          onClick={handleRank}
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Processing..." : "Generate Rankings"}
        </button>

        {message && (
          <div
            className={`mt-4 p-3 rounded ${
              message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
