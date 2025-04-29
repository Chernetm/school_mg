"use client";

import PrintTranscript from "@/components/PrintStudentPage";
import React, { useEffect, useState } from "react";

export default function StudentPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(null);
  const [section, setSection] = useState(null);
  const [grade, setGrade] = useState(null);

  useEffect(() => {
    if (!year || !section || !grade) return;

    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/student/transcript?year=${year}&section=${section}&grade=${grade}`);
        const data = await res.json();
        setStudents(data);
      } catch (error) {
        console.error("Failed to fetch student data", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [year, section, grade]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Student Transcripts</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Year */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              id="year"
              value={year || ""}
              onChange={(e) => setYear(e.target.value || null)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Year</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
          </div>

          {/* Section */}
          <div>
            <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-1">Section</label>
            <select
              id="section"
              value={section || ""}
              onChange={(e) => setSection(e.target.value || null)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Section</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>

          {/* Grade */}
          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
            <select
              id="grade"
              value={grade || ""}
              onChange={(e) => setGrade(e.target.value || null)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Grade</option>
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>
          </div>
        </div>

        {/* Display */}
        {year && grade && section && (
          <div className="mt-6">
            {loading ? (
              <div className="text-center text-blue-600 font-semibold">Loading student data...</div>
            ) : students.length === 0 ? (
              <div className="text-center text-gray-500">No student data found.</div>
            ) : (
              <PrintTranscript students={students} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
