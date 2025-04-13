'use client';

import { useEffect, useState } from 'react';
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';

const COLORS = ['#22c55e', '#ef4444']; // ✅ green for Paid, red for Unpaid

export default function FinancialSummary({ grade, month, year }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      const res = await fetch(
        `/api/head/financial-summary?grade=${grade}&month=${month}&year=${year}`
      );
      const json = await res.json();
      setData(json);
    };

    fetchSummary();
  }, [grade, month, year]);

  if (!data) return <p className="p-4">Loading summary...</p>;

  const chartData = [
    { name: 'Paid', value: data.paidCount },
    { name: 'Unpaid', value: data.unpaidCount },
  ];

  const renderLabel = ({ name, value, percent }) =>
    `${name}: ${value} (${(percent * 100).toFixed(0)}%)`;

  return (
    <div className="p-6 bg-white rounded-xl shadow max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Grade {data.grade} - {data.month} {data.year}
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label={renderLabel}
          >
            {chartData.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 text-sm text-gray-700 space-y-1 text-center">
        <p>👥 <strong>Total Students (Active):</strong> {data.totalActiveStudents}</p>
        <p>💰 <strong>Total Expected:</strong> ${data.totalExpected}</p>
        <p>💵 <strong>Total Paid:</strong> ${data.totalPaid}</p>
      </div>
    </div>
  );
}
