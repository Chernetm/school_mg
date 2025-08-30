"use client";
import { useState } from "react";
import StudentIDCard from "@/components/StudentIDCard";
import Spinner from "@/components/Loading/Spinner/page";

export default function StudentCardsPage() {
  const [year, setYear] = useState("");
  const [grade, setGrade] = useState("");
  const [section, setSection] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStudents = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setStudents([]);

    try {
      const res = await fetch(
        `/api/admin/student/id?year=${year}&grade=${grade}&section=${section}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setStudents(data.students || []);
      }
    } catch (err) {
      setError("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">
        🎓 Student ID Cards
      </h1>

      {/* Search Form */}
      <form
        onSubmit={fetchStudents}
        className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 bg-white p-6 rounded-xl shadow-md"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="e.g., 2025"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Grade</label>
          <input
            type="number"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="e.g., 10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Section</label>
          <input
            type="text"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="e.g., A"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 mt-6 rounded-lg hover:bg-blue-700 transition w-full"
        >
          {loading ? "Loading..." : "Fetch"}
        </button>
      </form>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-red-600 text-center mb-6 font-medium">{error}</p>
      )}

      {/* ID Cards Grid */}
      {!loading && students.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {students.map((student) => (
            <StudentIDCard key={student.studentID} student={student} />
          ))}
        </div>
      )}

      {/* No students */}
      {!loading && students.length === 0 && !error && (
        <p className="text-gray-500 text-center mt-6">
          No students found. Please search above.
        </p>
      )}
    </div>
  );
}
