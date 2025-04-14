'use client';

import { useState } from 'react';
import { FaBullhorn } from 'react-icons/fa';
import { MdCampaign } from 'react-icons/md';

export default function CreateAnnouncement() {
  const [form, setForm] = useState({
    title: '',
    message: '',
    audience: 'ALL',
    gradeId: '',
  });

  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Creating...');

    const res = await fetch('/api/announcement/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ title: '', message: '', audience: 'ALL', gradeId: '' });
      setStatus('✅ Announcement created!');
    } else {
      setStatus('❌ Error creating announcement.');
    }

    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-gradient-to-br from-blue-50 to-white shadow-xl rounded-2xl border border-blue-200">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 flex items-center gap-2">
        <MdCampaign className="text-blue-600" /> Create Announcement
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
          <input
            type="text"
            placeholder="Enter announcement title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
          <textarea
            placeholder="Enter message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full p-3 border text-white bg-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            rows="4"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Audience</label>
          <select
            value={form.audience}
            onChange={(e) => setForm({ ...form, audience: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          >
            <option value="ALL">All</option>
            <option value="STAFF">Staff Only</option>
            <option value="STUDENTS">Students Only</option>
            <option value="PARENTS">Parents Only</option>
            <option value="GRADE">Specific Grade</option>
          </select>
        </div>

        {form.audience === 'GRADE' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Grade ID</label>
            <input
              type="text"
              placeholder="Enter grade ID"
              value={form.gradeId}
              onChange={(e) => setForm({ ...form, gradeId: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition duration-200"
        >
          <FaBullhorn /> Post Announcement
        </button>

        {status && (
          <p className="text-center text-sm mt-4 text-blue-600 font-medium">{status}</p>
        )}
      </form>
    </div>
  );
}
