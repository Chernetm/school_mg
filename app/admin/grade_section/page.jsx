"use client";

import { useState } from "react";

const GradeSectionForm = () => {
  const [grade, setGrade] = useState("");
  const [sections, setSections] = useState([{ name: "", capacity: "" }]);
  const [status, setStatus] = useState("active");
  const [message, setMessage] = useState("");

  const handleGradeChange = (e) => setGrade(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value);

  const addSection = () => {
    setSections([...sections, { name: "", capacity: "" }]);
  };

  const handleSectionChange = (index, field, value) => {
    const updated = [...sections];
    updated[index][field] = value;
    setSections(updated);
  };

  const removeSection = (index) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!grade || sections.some(sec => !sec.name.trim() || !sec.capacity)) {
      alert("Grade, section names, and capacities are required.");
      return;
    }

    try {
      const response = await fetch("/api/admin/grade_section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade: parseInt(grade, 10),
          sections,
          status,
        }),
      });

      if (!response.ok) throw new Error("Failed to register grade and sections");

      setMessage("✅ Grade and sections registered successfully!");
      setGrade("");
      setSections([{ name: "", capacity: "" }]);
      setStatus("active");
    } catch (error) {
      setMessage("❌ Error: " + error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white text-gray-700 shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Register Grade & Sections
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Grade</label>
          <input
            type="number"
            value={grade}
            onChange={handleGradeChange}
            placeholder="Enter grade"
            className="w-full p-3 border rounded bg-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Sections & Capacities</label>
          {sections.map((section, index) => (
            <div key={index} className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={section.name}
                onChange={(e) => handleSectionChange(index, "name", e.target.value)}
                placeholder={`Section ${index + 1}`}
                className="w-1/2 p-3 border rounded bg-gray-100"
                required
              />
              <input
                type="number"
                value={section.capacity}
                onChange={(e) => handleSectionChange(index, "capacity", e.target.value)}
                placeholder="Capacity"
                className="w-1/3 p-3 border rounded bg-gray-100"
                required
              />
              {sections.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSection(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-400"
                >
                  ✖
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSection}
            className="mt-2 w-full px-4 py-2 bg-blue-500 hover:bg-blue-400 transition rounded text-white font-semibold"
          >
            + Add Section
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Status</label>
          <select
            value={status}
            onChange={handleStatusChange}
            className="w-full p-3 border rounded bg-gray-100"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-green-500 hover:bg-green-400 transition rounded text-white font-bold text-lg"
        >
          Submit
        </button>

        {message && (
          <p className="mt-4 text-center text-lg font-semibold text-green-600">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default GradeSectionForm;
