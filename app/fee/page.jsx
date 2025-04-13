"use client";
import { useState } from "react";
import { FaMoneyCheckAlt, FaSpinner } from "react-icons/fa";

export default function PayFee() {
  const [form, setForm] = useState({
    studentID: '',
    firstName: '',
    grade: 'Grade 9',
    month: 'April',
  });
  const [loading, setLoading] = useState(false);

  // Static fee amounts based on grade
  const gradeFees = {
    'Grade 9': 1000,
    'Grade 10': 1100,
    'Grade 11': 1200,
    'Grade 12': 1300,
  };

  const amount = gradeFees[form.grade] || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/payment/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, amount }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.link) {
      window.location.href = data.link;
    } else {
      alert(data.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl shadow-xl border">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Pay Student Fee
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Student ID"
          value={form.studentID}
          onChange={(e) => setForm({ ...form, studentID: e.target.value })}
          required
          className="w-full px-4 py-2 border rounded-xl focus:ring focus:ring-blue-200"
        />
        <input
          type="text"
          placeholder="First Name"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          required
          className="w-full px-4 py-2 border rounded-xl focus:ring focus:ring-blue-200"
        />

        <select
          value={form.grade}
          onChange={(e) => setForm({ ...form, grade: e.target.value })}
          className="w-full px-4 py-2 border rounded-xl bg-white focus:ring focus:ring-blue-200"
        >
          {['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map((grade) => (
            <option key={grade} value={grade}>{grade}</option>
          ))}
        </select>

        <select
          value={form.month}
          onChange={(e) => setForm({ ...form, month: e.target.value })}
          className="w-full px-4 py-2 border rounded-xl bg-white focus:ring focus:ring-blue-200"
        >
          {[
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ].map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>

        {amount > 0 && (
          <div className="text-center text-lg text-green-600 font-semibold">
            Fee Amount: {amount} ETB
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" /> Processing...
            </>
          ) : (
            <>
              <FaMoneyCheckAlt /> Pay Fee
            </>
          )}
        </button>
      </form>
    </div>
  );
}
