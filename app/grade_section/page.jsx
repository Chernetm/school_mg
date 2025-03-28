"use client";

import { useState } from "react";

const GradeSectionForm = () => {
  const [grade, setGrade] = useState("");
  const [sections, setSections] = useState([""]);
  const [status, setStatus] = useState("active");
  const [message, setMessage] = useState("");

  const handleGradeChange = (e) => {
    setGrade(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const addSection = () => {
    setSections([...sections, ""]);
  };

  const handleSectionChange = (index, value) => {
    const updatedSections = [...sections];
    updatedSections[index] = value;
    setSections(updatedSections);
  };

  const removeSection = (index) => {
    const updatedSections = sections.filter((_, i) => i !== index);
    setSections(updatedSections);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!grade || sections.some((section) => !section.trim())) {
      alert("Grade and all sections are required.");
      return;
    }

    try {
      const response = await fetch("/api/grade_section", {
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
      setSections([""]);
      setStatus("active");
    } catch (error) {
      setMessage("❌ Error: " + error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white text-gray-700 shadow-lg rounded-xl">
      <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
        Register Grade & Sections
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-2 text-gray-600">Grade</label>
          <input
            type="number"
            value={grade}
            onChange={handleGradeChange}
            placeholder="Enter grade (e.g., 10)"
            className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-2 text-gray-600">Sections</label>
          {sections.map((section, index) => (
            <div key={index} className="flex items-center space-x-2 mb-3">
              <input
                type="text"
                value={section}
                onChange={(e) => handleSectionChange(index, e.target.value)}
                placeholder={`Section ${index + 1}`}
                className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                required
              />
              {sections.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSection(index)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-400 transition rounded-lg text-white"
                >
                  ✖
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSection}
            className="mt-2 w-full px-4 py-2 bg-blue-500 hover:bg-blue-400 transition rounded-lg text-white font-semibold"
          >
            + Add Section
          </button>
        </div>

        <div>
          <label className="block font-semibold mb-2 text-gray-600">Status</label>
          <select
            value={status}
            onChange={handleStatusChange}
            className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-green-500 hover:bg-green-400 transition rounded-lg text-white font-bold text-lg"
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