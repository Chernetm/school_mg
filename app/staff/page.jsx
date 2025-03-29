"use client"
import { useEffect, useState } from 'react';

export default function AssignForm({ staff, onClose }) {
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [gradeId, setGradeId] = useState(null);
  const [subjectId, setSubjectId] = useState(null);
  const [selectedSections, setSelectedSections] = useState([]);

  // Fetch Grades
  useEffect(() => {
    fetch('/api/grade')
      .then((res) => res.json())
      .then(setGrades)
      .catch((err) => console.error('Error fetching grades:', err));
  }, []);

  // Fetch Subjects
  useEffect(() => {
    fetch('/api/subject')
      .then((res) => res.json())
      .then(setSubjects)
      .catch((err) => console.error('Error fetching subjects:', err));
  }, []);

  // Fetch Sections based on selected Grade
  useEffect(() => {
    if (gradeId) {
      fetch(`/api/grade_section/${gradeId}`)
        .then((res) => res.json())
        .then((data) => setSections(data.map((item) => item.section)))
        .catch((err) => console.error('Error fetching sections:', err));
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
      alert('Please select grade, subject, and at least one section.');
      return;
    }

    try {
      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId: staff.id,
          gradeId,
          subjectId,
          sectionIds: selectedSections,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign staff.');
      }

      alert('Assignment successful');
      onClose();
    } catch (error) {
      console.error('Error submitting assignment:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full">
        <h3 className="text-xl mb-4">Assign </h3>
        <form onSubmit={handleSubmit}>
          {/* Grade Dropdown */}
          <label className="block mb-2">Grade</label>
          <select
            className="w-full p-2 border rounded mb-4"
            value={gradeId || ''}
            onChange={(e) => setGradeId(Number(e.target.value))}
          >
            <option value="">Select Grade</option>
            {grades.map((g) => (
              <option key={g.id} value={g.id}>
                {g.grade}
              </option>
            ))}
          </select>

          {/* Section Checkboxes */}
          <label className="block mb-2">Sections</label>
          <div className="mb-4">
            {sections.map((section) => (
              <label key={section.id} className="block">
                <input
                  type="checkbox"
                  value={section.id}
                  checked={selectedSections.includes(section.id)}
                  onChange={() => handleSectionChange(section.id)}
                />
                <span className="ml-2">{section.section}</span>
              </label>
            ))}
          </div>

          {/* Subject Dropdown */}
          <label className="block mb-2">Subject</label>
          <select
            className="w-full p-2 border rounded mb-4"
            value={subjectId || ''}
            onChange={(e) => setSubjectId(Number(e.target.value))}
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
              Submit
            </button>
            <button onClick={onClose} type="button" className="px-4 py-2 bg-red-600 text-white rounded">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
