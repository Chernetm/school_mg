"use client";
import { useState } from "react";

export default function ExamResults() {
  const [examTitle, setExamTitle] = useState("");
  const [results, setResults] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResults = async () => {
    if (!examTitle.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]);
    setTotalQuestions(0);

    try {
      const response = await fetch(`/api/exam/get_result?title=${encodeURIComponent(examTitle)}`);
      if (!response.ok) throw new Error("Exam not found");

      const data = await response.json();
      setResults(data.students);
      setTotalQuestions(data.totalQuestions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Exam Results</h1>

      {/* Input for Exam Title */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter Exam Title"
          value={examTitle}
          onChange={(e) => setExamTitle(e.target.value)}
          className="border border-gray-400 p-2 rounded w-full bg-white text-gray-900"
        />
        <button
          onClick={fetchResults}
          disabled={loading || !examTitle.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Find Exam"}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Results Table */}
      {results.length > 0 && (
        <table className="mt-4 w-full border border-gray-300 bg-white text-gray-900 shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2 text-left">Student Name</th>
              <th className="border p-2 text-center">Score</th>
            </tr>
          </thead>
          <tbody>
            {results.map((student, index) => (
              <tr key={index} className="border-b">
                <td className="border p-2">{student.name}</td>
                <td className="border p-2 text-center font-semibold">
                  {student.score} / {totalQuestions}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* No results message */}
      {results.length === 0 && !loading && !error && (
        <p className="text-gray-700 mt-4">No results found.</p>
      )}
    </div>
  );
}
