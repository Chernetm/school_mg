'use client';
import Spinner from '@/components/Loading/Spinner/page';
import { useState } from 'react';

export default function StudentList() {
  const [year, setYear] = useState('');
  const [grade, setGrade] = useState('');
  const [section, setSection] = useState('');
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchStudents = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStudents([]);

    try {
      const res = await fetch(
        `/api/admin/student/list?year=${year}&grade=${grade}&section=${section}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        setStudents(data.students);
      }
    } catch (err) {
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };
  if(loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }


  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">🎓 View Students by Year, Grade & Section</h2>

      <form onSubmit={fetchStudents} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="e.g., 2024"
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
          {loading ? 'Loading...' : 'Fetch'}
        </button>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {students.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-blue-800">#</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-blue-800">Student ID</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-blue-800">First Name</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-blue-800">Last Name</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, idx) => (
                <tr key={student.studentID} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2 font-mono">{student.studentID}</td>
                  <td className="px-4 py-2">{student.firstName}</td>
                  <td className="px-4 py-2">{student.lastName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && students.length === 0 && !error && (
        <p className="text-gray-500 text-center mt-4">No students found.</p>
      )}
    </div>
  );
}
