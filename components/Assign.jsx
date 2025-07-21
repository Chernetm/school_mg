"use client";
import { useEffect, useState } from "react";

export default function AssignForm({ staff, onClose }) {
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [gradeId, setGradeId] = useState(null);
  const [subjectId, setSubjectId] = useState(null);
  const [selectedSections, setSelectedSections] = useState([]);

  useEffect(() => {
    fetch("/api/admin/grade_section/grade")
      .then((res) => res.json())
      .then(setGrades)
      .catch((err) => console.error("Error fetching grades:", err));
  }, []);

  useEffect(() => {
    fetch("/api/admin/subject")
      .then((res) => res.json())
      .then(setSubjects)
      .catch((err) => console.error("Error fetching subjects:", err));
  }, []);

  useEffect(() => {
    if (gradeId) {
      fetch(`/api/admin/grade_section/section?gradeId=${gradeId}`)
        .then((res) => res.json())
        .then(setSections)
        .catch((err) => console.error("Error fetching sections:", err));
    } else {
      setSections([]);
    }
  }, [gradeId]);

  const handleSectionChange = (id) => {
    setSelectedSections((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gradeId || !subjectId || selectedSections.length === 0) {
      alert("Please select grade, subject, and at least one section.");
      return;
    }

    try {
      const response = await fetch("/api/admin/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffID: staff.staffID,
          gradeId,
          subjectId,
          sectionIds: selectedSections,
        }),
      });

      if (!response.ok) throw new Error("Failed to assign staff.");

      alert("✅ Assignment successful");
      onClose();
    } catch (error) {
      console.error("Error submitting assignment:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-xl">
        <h3 className="text-2xl font-bold mb-6 text-gray-900">Assign Staff</h3>
        <form onSubmit={handleSubmit}>
          {/* Grade Dropdown */}
          <label className="block mb-1 text-sm font-semibold text-gray-800">Grade</label>
          <select
            className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 mb-4"
            value={gradeId || ""}
            onChange={(e) => setGradeId(Number(e.target.value))}
          >
            <option value="">Select Grade</option>
            {grades.map((g) => (
              <option key={g.id} value={g.id}>
                {g.grade}
              </option>
            ))}
          </select>

          {/* Sections */}
          <label className="block mb-1 text-sm font-semibold text-gray-800">Sections</label>
          <div className="mb-4 space-y-2">
            {sections.map((section) => (
              <label key={section.id} className="flex items-center space-x-2 text-gray-800">
                <input
                  type="checkbox"
                  value={section.id}
                  checked={selectedSections.includes(section.id)}
                  onChange={() => handleSectionChange(section.id)}
                  className="accent-blue-600"
                />
                <span>{section.name}</span>
              </label>
            ))}
          </div>

          {/* Subject Dropdown */}
          <label className="block mb-1 text-sm font-semibold text-gray-800">Subject</label>
          <select
            className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 mb-4"
            value={subjectId || ""}
            onChange={(e) => setSubjectId(Number(e.target.value))}
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg">
              Submit
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}