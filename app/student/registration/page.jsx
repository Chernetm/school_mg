'use client';

import { useState } from 'react';

export default function RegisterPage() {
  const [grade, setGrade] = useState('');
  const [year, setYear] = useState('');
  const [stream, setStream] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const body = {
        grade: parseInt(grade),
        year: parseInt(year),
      };

      // ✅ Only include stream when grade is 11
      if (parseInt(grade) === 11) {
        if (!stream) {
          setMessage('Please select a stream for grade 11');
          setLoading(false);
          return;
        }
        body.stream = stream; // send as selected (NATURAL or SOCIAL)
      }

      const res = await fetch('/api/student/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setMessage('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-2">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full transition-all duration-300">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Student Registration
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          >
            <option value="">Select Grade</option>
            <option value="9">Grade 9</option>
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
          </select>

          {/* ✅ Only show stream for Grade 11 */}
          {parseInt(grade) === 11 && (
            <select
              value={stream}
              onChange={(e) => setStream(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            >
              <option value="">Select Stream</option>
              <option value="NATURAL">Natural Science</option>
              <option value="SOCIAL">Social Science</option>
            </select>
          )}

          <input
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-300"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}
      </div>
    </div>
  );
}
