
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function ExamResults() {
  const [exams, setExams] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [results, setResults] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();



  // Fetch list of MODEL exams with submissions
  const fetchExams = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/exam/list');
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

  // Fetch results for selected exam
  const fetchResults = async (title) => {
    setLoading(true);
    setError(null);
    setResults([]);
    setTotalQuestions(0);

    try {
      const response = await fetch(`/api/admin/exam/result?title=${encodeURIComponent(title)}`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Exam not found');
      }

      const data = await response.json();
      setResults(data.students);
      setTotalQuestions(data.totalQuestions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && ['head', 'admin'].includes(session?.user.role)) {
      fetchExams();
    }
  }, [session, status]);

  useEffect(() => {
    if (selectedTitle) {
      fetchResults(selectedTitle);
    }
  }, [selectedTitle]);

  if (status === 'loading') {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
        <p className="text-gray-600 text-center">Loading...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
        <p className="text-red-500 text-center">Please log in to view exam results.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Exam Results</h1>

      {/* Exam List */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Select an Exam</h2>
        {loading && !selectedTitle ? (
          <p className="text-gray-600">Loading exams...</p>
        ) : error && !selectedTitle ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : exams.length === 0 ? (
          <p className="text-gray-700">No exams with submissions found.</p>
        ) : (
          <ul className="space-y-2">
            {exams.map((exam) => (
              <li key={exam.id}>
                <button
                  onClick={() => setSelectedTitle(exam.title)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    selectedTitle === exam.title
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

      {/* Results Table */}
      {results.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Results for {selectedTitle}
          </h2>
          <table className="w-full border border-gray-300 bg-white text-gray-900 shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2 text-left">Student ID</th>
                <th className="border p-2 text-left">First Name</th>
                <th className="border p-2 text-left">Last Name</th>
                <th className="border p-2 text-left">Grade</th>
                <th className="border p-2 text-left">Section</th>
                <th className="border p-2 text-center">Score</th>
              </tr>
            </thead>
            <tbody>
              {results.map((student, index) => (
                <tr key={index} className="border-b">
                  <td className="border p-2">{student.studentID}</td>
                  <td className="border p-2">{student.firstName}</td>
                  <td className="border p-2">{student.lastName}</td>
                  <td className="border p-2">{student.grade}</td>
                  <td className="border p-2">{student.section}</td>
                  <td className="border p-2 text-center font-semibold">
                    {student.score} / {totalQuestions}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No results message */}
      {selectedTitle && results.length === 0 && !loading && !error && (
        <p className="text-gray-700 mt-4">No results found for this exam.</p>
      )}
      {selectedTitle && error && <p className="text-red-500 text-sm mt-4">{error}</p>}
    </div>
  );
}