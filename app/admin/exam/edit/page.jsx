
'use client';
import { useEffect, useState } from 'react';

export default function ExamList() {
  const [exams, setExams] = useState([]);
  const [updatedExams, setUpdatedExams] = useState([]);
  const [grade, setGrade] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (grade) {
      fetchExams();
    }
  }, [grade]);

  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [success]);

  const fetchExams = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`/api/admin/exam/edit?grade=${grade}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch exams');
      }
      setExams(data);
      setUpdatedExams(data.map(exam => ({ ...exam })));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (examId, field, value) => {
    setUpdatedExams((prev) =>
      prev.map((exam) =>
        exam.id === examId ? { ...exam, [field]: value } : exam
      )
    );
  };

  const handleUpdate = async (examId) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const examToUpdate = updatedExams.find(exam => exam.id === examId);
      const response = await fetch('/api/admin/exam/edit', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          examId,
          title: examToUpdate.title,
          description: examToUpdate.description,
          grade: examToUpdate.grade,
          status: examToUpdate.status,
          type: examToUpdate.type,
          durationMinutes: examToUpdate.durationMinutes,
        }),
      });
      const updatedExam = await response.json();
      if (!response.ok) {
        throw new Error(updatedExam.message || 'Failed to update exam');
      }

      setExams((prev) =>
        prev.map((exam) => (exam.id === updatedExam.id ? updatedExam : exam))
      );
      setUpdatedExams((prev) =>
        prev.map((exam) => (exam.id === updatedExam.id ? updatedExam : exam))
      );
      setSuccess('Exam updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (examId) => {
  if (!confirm('Are you sure you want to delete this exam?')) return;

  // Optimistically remove from UI
  const prevExams = [...exams];
  const prevUpdatedExams = [...updatedExams];
  setExams((prev) => prev.filter((exam) => exam.id !== examId));
  setUpdatedExams((prev) => prev.filter((exam) => exam.id !== examId));

  setLoading(true);
  setError(null);
  setSuccess(null);

  try {
    const response = await fetch(`/api/admin/exam/delete?examId=${examId}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete exam');
    }

    setSuccess('Exam deleted successfully!');
  } catch (err) {
    // Revert optimistic update on error
    setExams(prevExams);
    setUpdatedExams(prevUpdatedExams);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Exam List</h1>

      {error && <p className="mb-4 text-red-600">Error: {error}</p>}
      {success && <p className="mb-4 text-green-600">{success}</p>}
      {loading && <p className="text-gray-600 mb-4">Loading...</p>}

      <div className="mb-4">
        <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
          Select Grade
        </label>
        <select
          id="grade"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm bg-white text-black focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select Grade</option>
          {[6, 7, 8, 9, 10, 11, 12].map((g) => (
            <option key={g} value={g}>
              Grade {g}
            </option>
          ))}
        </select>
      </div>

      {exams.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">Title</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">Description</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">Grade</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">Duration (min)</th>
                <th className="px-15 py-3 text-left text-sm font-semibold text-blue-800">Edit Title</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">Edit Description</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">Edit Grade</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">Edit Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">Edit Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">Edit Duration</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">Delete</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {updatedExams.map((exam) => (
                <tr key={exam.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 border text-black">{exam.title}</td>
                  <td className="px-4 py-2 border text-black">{exam.description || 'N/A'}</td>
                  <td className="px-4 py-2 border text-black">{exam.grade}</td>
                  <td className="px-4 py-2 border text-black">{exam.type}</td>
                  <td className="px-4 py-2 border">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium text-black ${
                        exam.status === 'ACTIVE' ? 'bg-green-200' : 'bg-red-100'
                      }`}
                    >
                      {exam.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border text-black">{exam.durationMinutes}</td>
                  <td className="px-4 py-2 border">
                    <input
                      type="text"
                      value={exam.title}
                      onChange={(e) => handleInputChange(exam.id, 'title', e.target.value)}
                      className="border rounded p-1 text-sm text-black w-full"
                      placeholder="Enter title"
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <input
                      type="text"
                      value={exam.description || ''}
                      onChange={(e) => handleInputChange(exam.id, 'description', e.target.value)}
                      className="border rounded p-1 text-sm text-black w-full"
                      placeholder="Enter description"
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <select
                      value={exam.grade}
                      onChange={(e) => handleInputChange(exam.id, 'grade', e.target.value)}
                      className="border rounded p-1 text-sm text-black"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                        <option key={g} value={g}>
                          Grade {g}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 border">
                    <select
                      value={exam.type}
                      onChange={(e) => handleInputChange(exam.id, 'type', e.target.value)}
                      className="border rounded p-1 text-sm text-black"
                    >
                      {['EXAM', 'MODEL'].map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 border">
                    <select
                      value={exam.status}
                      onChange={(e) => handleInputChange(exam.id, 'status', e.target.value)}
                      className="border rounded p-1 text-sm text-black"
                    >
                      {['ACTIVE', 'INACTIVE'].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 border">
                    <input
                      type="number"
                      value={exam.durationMinutes}
                      onChange={(e) => handleInputChange(exam.id, 'durationMinutes', e.target.value)}
                      className="border rounded p-1 text-sm text-black w-full"
                      min="1"
                      placeholder="Enter duration"
                    />
                  </td>
                  <td className="px-4 py-2 border space-x-2">
                    
                    <button
                      onClick={() => handleDelete(exam.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                  <td className="px-4 py-2 border space-x-2">
                    <button
                      onClick={() => handleUpdate(exam.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                      disabled={loading}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
