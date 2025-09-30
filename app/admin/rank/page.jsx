"use client"
import LoadingButton from "@/components/LoadingButton";
import React, { useState } from "react";

export default function StudentRankUpdater() {
  const [year, setYear] = useState();
  const [grade, setGrade] = useState("");
  const [section, setSection] = useState("");
  const [semester, setSemester] = useState(""); // new state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/admin/rank", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year, grade, section, semester }), // include semester
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-16 p-6 bg-white border border-gray-200 rounded-xl shadow-md space-y-6">
      <h1 className="text-1xl font-semibold text-center text-gray-800">Evaluate Student Ranks</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <input
            type="number"
            placeholder="e.g. 2025"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
          <input
            type="text"
            placeholder="e.g. 10"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
          <input
            type="text"
            placeholder="e.g. A"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
          <select
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            required
          >
            <option value="" disabled>Select semester</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
        <LoadingButton
          loading={loading}
          text="Update Ranks"
          loadingText="Updating ..."
        />
      </form>

      {message && <p className="text-green-600 font-medium text-center">{message}</p>}
      {error && <p className="text-red-600 font-medium text-center">{error}</p>}
    </div>
  );
}
