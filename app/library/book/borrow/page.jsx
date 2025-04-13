"use client"
import { useState } from 'react';
import { FaBookOpen, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaUserAlt } from 'react-icons/fa'; // Correct imports for React Icons

export default function BorrowBook() {
  const [form, setForm] = useState({
    studentId: '',
    bookId: '',
    borrowDate: '',
    returnDate: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/library/book/borrow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage(data.message);
      setError(false);
      setForm({ studentId: '', bookId: '', borrowDate: '', returnDate: '' });
    } else {
      setMessage(data.error || 'Something went wrong.');
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg border border-teal-100">
        <h1 className="text-3xl font-bold text-teal-700 mb-6 text-center">
          📖 Borrow a Book
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student ID
            </label>
            <div className="relative">
              <FaUserAlt className="absolute top-2.5 left-3 text-gray-400" size={18} />
              <input
                type="number"
                name="studentId"
                value={form.studentId}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter Student ID"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Book ID
            </label>
            <div className="relative">
              <FaBookOpen className="absolute top-2.5 left-3 text-gray-400" size={18} />
              <input
                type="number"
                name="bookId"
                value={form.bookId}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter Book ID"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Borrow Date
            </label>
            <div className="relative">
              <FaCalendarAlt className="absolute top-2.5 left-3 text-gray-400" size={18} />
              <input
                type="date"
                name="borrowDate"
                value={form.borrowDate}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Return Date
            </label>
            <div className="relative">
              <FaCalendarAlt className="absolute top-2.5 left-3 text-gray-400" size={18} />
              <input
                type="date"
                name="returnDate"
                value={form.returnDate}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200"
          >
            Submit Borrow
          </button>
        </form>

        {message && (
          <div
            className={`mt-6 flex items-center gap-2 p-4 rounded-lg text-sm font-medium ${
              error
                ? 'bg-red-100 text-red-700 border border-red-300'
                : 'bg-green-100 text-green-700 border border-green-300'
            }`}
          >
            {error ? <FaTimesCircle size={20} /> : <FaCheckCircle size={20} />}
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
