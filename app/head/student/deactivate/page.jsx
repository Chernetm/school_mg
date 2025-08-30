"use client";

import { useState } from "react";
import { HiCheckCircle, HiXCircle, HiOutlineRefresh } from "react-icons/hi";

export default function BulkDeactivateStudents() {
  const [grade, setGrade] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleDeactivate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/head/student/deactivate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade: Number(grade), year: Number(year) }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to deactivate students");

      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-16 p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        🚫 Bulk Deactivate Students
      </h1>

      <form onSubmit={handleDeactivate} className="space-y-6">
        {/* Year Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Academic Year
          </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="e.g. 2024"
            required
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Grade Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Grade
          </label>
          <input
            type="number"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="e.g. 10"
            required
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-60"
        >
          {loading ? (
            <>
              <HiOutlineRefresh className="animate-spin w-5 h-5" />
              Processing...
            </>
          ) : (
            "Deactivate Students"
          )}
        </button>
      </form>

      {/* Messages */}
      {message && (
        <div className="mt-6 flex items-center gap-2 text-green-700 bg-green-100 border border-green-300 rounded-xl px-4 py-3">
          <HiCheckCircle className="w-5 h-5" />
          <span>{message}</span>
        </div>
      )}
      {error && (
        <div className="mt-6 flex items-center gap-2 text-red-700 bg-red-100 border border-red-300 rounded-xl px-4 py-3">
          <HiXCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
