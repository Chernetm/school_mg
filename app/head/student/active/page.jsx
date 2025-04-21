"use client";

import Spinner from "@/components/Loading/Spinner/page";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const gradeColors = {
  "Grade 9": "#4CAF50",
  "Grade 10": "#2196F3",
  "Grade 11": "#FF9800",
  "Grade 12": "#F44336",
};

export default function StudentChart() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStudentCounts = async (year) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/head/student/active?year=${year}`);
      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();
      const grades = [9, 10, 11, 12];

      const formatted = grades.map((grade) => {
        const found = data.find((d) => d.grade === grade);
        return {
          grade: `Grade ${grade}`,
          students: found ? found.count : 0,
        };
      });

      setStudentData(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentCounts(selectedYear);
  }, [selectedYear]);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mt-24 px-6 max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">
        Active Students by Grade
      </h2>

      <div className="flex justify-center mb-6">
        <label htmlFor="year" className="mr-3 font-semibold text-lg">
          Select Year:
        </label>
        <select
          id="year"
          className="border border-gray-400 px-4 py-2 rounded-md text-lg"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
          {[...Array(6)].map((_, idx) => {
            const year = currentYear - idx;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading student data...</p>
      ) : (
        <div className="overflow-x-auto">
          <BarChart width={700} height={400} data={studentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="grade" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="students">
              {studentData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={gradeColors[entry.grade] || "#8884d8"}
                />
              ))}
            </Bar>
          </BarChart>
        </div>
      )}
    </div>
  );
}
