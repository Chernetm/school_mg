"use client";

import LoadingButton from "@/components/LoadingButton";
import { useState } from "react";

const AssignSectionForm = () => {
  const [grade, setGrade] = useState("");
  const [year, setYear] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/grade_section/assign_section", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade: parseInt(grade),
          year: parseInt(year),
        }),
      });

      const result = await response.json();
      setMessage(result.message);
    } catch (error) {
      setMessage("❌ Failed to assign sections");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Assign Sections to Students
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Grade
          </label>
          <input
            type="number"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="Enter grade (e.g., 10)"
            className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Year
          </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Enter academic year (e.g., 2025)"
            className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <LoadingButton
                  loading={loading}
                  text="Assign Sections"
                  loadingText="Assigning section ..."
          />

        

        {message && (
          <p className="mt-4 text-center font-medium text-blue-700">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default AssignSectionForm;