'use client';

import Spinner from '@/components/Loading/Spinner/page';
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
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true); // Start loading spinner
      try {
        const res = await fetch(
          `/api/head/financial-summary?grade=${grade}&month=${month}&year=${year}`
        );
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching financial summary:", error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    if (grade && month && year) { // Ensure values are set before fetching
      fetchSummary();
    }
  }, [grade, month, year]);

  
  
  const chartData = [
    { name: 'Paid', value: data.paidCount },
    { name: 'Unpaid', value: data.unpaidCount },
  ];

  const renderLabel = ({ name, value, percent }) =>
    `${name}: ${value} (${(percent * 100).toFixed(0)}%)`;
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }
  if (!data) {
    return <p className="text-center text-gray-500">No data available.</p>;
  }

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
