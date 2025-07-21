'use client';
import { useEffect, useState } from 'react';

export default function StudentExamResults() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch list of submitted exams
  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/student/exam/submitted');
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to fetch exams');
        }
        const data = await response.json();
        setExams(data.exams);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  // Fetch results for selected exam
  const fetchResults = async (title) => {
    setLoading(true);
    setError(null);
    setQuestions([]);
    setTotalQuestions(0);
    setTotalCorrect(0);

    try {
      const response = await fetch(`/api/student/exam/result?title=${encodeURIComponent(title)}`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Exam or results not found');
      }

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

  const handleSelectExam = (title) => {
    setSelectedExam(title);
    fetchResults(title);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">📘 Student Exam Results</h1>

      {/* Exam List */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Submitted Exams</h2>
        {loading && !selectedExam && <p className="text-gray-600">Loading exams...</p>}
        {error && !selectedExam && <p className="text-red-600 text-sm">{error}</p>}
        {exams.length === 0 && !loading && !error ? (
          <p className="text-gray-700">No submitted exams found.</p>
        ) : (
          <ul className="space-y-2">
            {exams.map((exam) => (
              <li key={exam.id}>
                <button
                  onClick={() => handleSelectExam(exam.title)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    selectedExam === exam.title
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
                >
                  {exam.title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

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
                  let bgColor = 'bg-gray-200 text-gray-900'; // Default

                  if (isCorrect) bgColor = 'bg-green-500 text-white font-bold'; // Correct answer
                  if (isStudentAnswer && !question.isCorrect)
                    bgColor = 'bg-red-500 text-white font-bold'; // Incorrect student answer

                  return (
                    <li key={key} className={`p-3 rounded-lg ${bgColor} shadow-md`}>
                      <span className="font-semibold">{key}: </span> {value}
                    </li>
                  );
                })}
              </ul>

              {/* Show student answer status */}
              {question.studentAnswer !== null && (
                <p
                  className={`mt-3 text-lg ${
                    question.isCorrect ? 'text-green-700' : 'text-red-700 font-semibold'
                  }`}
                >
                  🎯 Your Answer: {question.studentAnswer} (
                  {question.isCorrect ? '✅ Correct' : '❌ Incorrect'})
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* No results message */}
      {selectedExam && questions.length === 0 && !loading && !error && (
        <p className="text-gray-700 mt-4 text-center">⚠️ No results found for this exam.</p>
      )}
    </div>
  );
}