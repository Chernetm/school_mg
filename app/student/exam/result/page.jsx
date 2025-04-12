
"use client";
import { useState } from "react";

export default function StudentExamResults() {
  const [examTitle, setExamTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResults = async () => {
    if (!examTitle.trim()) return;

    setLoading(true);
    setError(null);
    setQuestions([]);
    setTotalQuestions(0);
    setTotalCorrect(0);

    try {
      const response = await fetch(
        `/api/student/exam/result?title=${encodeURIComponent(examTitle)}`
      );
      if (!response.ok) throw new Error("Exam or Student not found");

      const data = await response.json();
      setQuestions(data);

      // Calculate total correct answers
      const correctAnswers = data.filter((q) => q.isCorrect).length;
      setTotalCorrect(correctAnswers);
      setTotalQuestions(data.length);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">📘 Student Exam Results</h1>

      {/* Input Fields */}
      <div className="flex flex-col gap-3 mb-6">
        <input
          type="text"
          placeholder="📖 Enter Exam Title"
          value={examTitle}
          onChange={(e) => setExamTitle(e.target.value)}
          className="border border-gray-500 p-3 rounded w-full bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={fetchResults}
          disabled={loading || !examTitle.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-all duration-300 ease-in-out"
        >
          {loading ? "🔄 Loading..." : "🎯 Fetch Results"}
        </button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* Display Total Score */}
      {totalQuestions > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4 text-center">
          <p className="text-xl font-semibold text-gray-800">
            🏆 Score: <span className="text-blue-600">{totalCorrect}</span> / {totalQuestions}
          </p>
        </div>
      )}

      {/* Results Table */}
      {questions.length > 0 && (
        <div className="mt-4 bg-white p-5 rounded-lg shadow-lg">
          {questions.map((question, index) => (
            <div key={question.questionId} className="mb-6 p-4 border-b border-gray-300">
              <p className="font-semibold text-lg text-gray-900 mb-2">
                {index + 1}. {question.content}
              </p>
              <ul className="mt-2 space-y-2">
                {Object.entries(question.options).map(([key, value]) => {
                  const isCorrect = key === question.correctAnswer;
                  const isStudentAnswer = key === question.studentAnswer;
                  let bgColor = "bg-gray-200 text-gray-900"; // Default

                  if (isCorrect) bgColor = "bg-green-500 text-white font-bold"; // Correct answer
                  if (isStudentAnswer && !question.isCorrect)
                    bgColor = "bg-red-500 text-white font-bold"; // Incorrect student answer

                  return (
                    <li key={key} className={`p-3 rounded-lg ${bgColor} shadow-md`}>
                      <span className="font-semibold">{key}: </span> {value}
                    </li>
                  );
                })}
              </ul>

              {/* Show student answer status */}
              {question.studentAnswer !== null && (
                <p className={`mt-3 text-lg ${question.isCorrect ? "text-green-700" : "text-red-700 font-semibold"}`}>
                  🎯 Your Answer: {question.studentAnswer} ({question.isCorrect ? "✅ Correct" : "❌ Incorrect"})
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* No results message */}
      {questions.length === 0 && !loading && !error && (
        <p className="text-gray-700 mt-4 text-center">⚠️ No results found.</p>
      )}
    </div>
  );
}
