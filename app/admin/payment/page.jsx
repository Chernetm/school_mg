
'use client';
import Spinner from '@/components/Loading/Spinner/page';
import { useState } from 'react';
import { useTranslation } from '@/app/providers';


const grades = [9, 10, 11, 12];
const sections=["A", "B","C","D","E","F"];
const years = [2018, 2019, 2020, 2021, 2025];
const monthKeys = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
export default function StudentList() {

  const { t } = useTranslation();
  const [year, setYear] = useState(2018);
  const [grade, setGrade] = useState(9);
  const [section, setSection] = useState('A');
  const [month, setSelectedMonth] = useState('April');
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
        `/api/admin/payment?year=${year}&grade=${grade}&section=${section}&month=${month}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        setStudents(
          data.students.map((s) => ({
            ...s,
            status: s.status || 'unpaid',
          }))
        );
      }
    } catch (err) {
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const togglePaymentStatus = async (student) => {
    try {
      const newStatus = student.status === 'paid' ? 'unpaid' : 'paid';

      const res = await fetch('/api/admin/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: Number(year),
          grade,
          studentID: student.studentID,
          month,
          status: newStatus,
        }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      setStudents((prev) =>
        prev.map((s) =>
          s.studentID === student.studentID ? { ...s, status: newStatus } : s
        )
      );
    } catch {
      alert('Error updating payment status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 mt-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-blue-700 text-center">
        🎓 Students Payment
      </h2>

      {/* Search Form */}
      <form onSubmit={fetchStudents} className="flex flex-col gap-3 mb-4">
      <div className="flex flex-wrap gap-2">
        
        {/* Grade Selection */}
        <div className="flex-1 min-w-[100px]">
          <label className="block text-xs font-medium mb-1">Grade</label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm"
          >
            {grades.map((grade) => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[100px]">
          <label className="block text-xs font-medium mb-1">Section</label>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm"
          >
            {sections.map((section) => (
              <option key={section} value={section}>{section}</option>
            ))}
          </select>
        </div>

        {/* Month Selection */}
       <div className="flex-1 min-w-[120px]">
          <label className="block text-xs font-medium mb-1">Month</label>
          <select
            value={month}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm"
          >
            {monthKeys.map((monthKey) => (
              <option key={monthKey} value={monthKey}>
                {t(monthKey.toLowerCase())} {/* show translated label */}
              </option>
            ))}
          </select>
        </div>
        {/* Year Selection */}
        <div className="flex-1 min-w-[90px]">
          <label className="block text-xs font-medium mb-1">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value, 10))}
            className="w-full border rounded px-2 py-1 text-sm"
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition w-full"
        >
          {loading ? 'Loading...' : 'Fetch'}
        </button>
      </form>

      {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}

      {/* Students Table */}
      {students.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-gray-200">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-1 py-1">#</th>
                <th className="px-2 py-1">ID</th>
                <th className="px-1 py-1">First Name</th>
                <th className="px-1 py-1">Middle Name</th>
                <th className="px-1 py-1">Last Name</th>
                <th className="px-1 py-1">Status</th>
                <th className="px-1 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, idx) => (
                <tr
                  key={student.studentID}
                  className="border-t hover:bg-gray-50 text-center"
                >
                  <td className="px-1 py-1">{idx + 1}</td>
                  <td className="px-1 py-1 font-mono">{student.studentID}</td>
                  <td className="px-1 py-1">{student.firstName}</td>
                  <td className="px-1 py-1">{student.middleName}</td>
                  <td className="px-1 py-1">{student.lastName}</td>
                  <td className="px-1 py-1">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] ${
                        student.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="px-1 py-1">
                    <button
                      onClick={() => togglePaymentStatus(student)}
                      className="px-2 py-1 text-[10px] rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Toggle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && students.length === 0 && !error && (
        <p className="text-gray-500 text-center text-sm mt-3">
          No students found.
        </p>
      )}
    </div>
  );
}
