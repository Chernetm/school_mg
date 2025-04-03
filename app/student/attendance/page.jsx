"use client";
import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, Tooltip } from "recharts";

export default function AttendanceCard () {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch("/api/attendance/student/id"); // No studentID needed
        const data = await res.json();
        setAttendance(data);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (!attendance) return <p className="text-center text-red-500">No attendance data found</p>;

  const presentPercentage = attendance.presentPercentage ?? 0;

  const data = [
    { name: "Present", value: presentPercentage, color: "#4CAF50" },
    { name: "Absent", value: attendance.absentPercentage ?? 0, color: "#F44336" },
    { name: "Late", value: attendance.latePercentage ?? 0, color: "#FF9800" },
  ];

  // Define the message based on attendance percentage
  const message =
    presentPercentage > 85
      ? "Great job! Keep up the excellent attendance!"
      : "Warning! Your attendance should be more than 85%.";

  return (
    <div className="bg-gray-50 shadow-lg rounded-2xl p-6 w-80 mx-auto mt-25">
      <h2 className="text-xl font-bold text-gray-700 text-center">Attendance Summary</h2>
      <div className="flex justify-center mt-4">
        <PieChart width={220} height={220}>
          <Pie data={data} cx="50%" cy="50%" outerRadius={70} fill="#8884d8" dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
      <div className="mt-4 space-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex justify-between text-sm">
            <span className="font-medium" style={{ color: item.color }}>{item.name}</span>
            <span className="font-bold">{(item.value ?? 0).toFixed(1)}%</span>
          </div>
        ))}
      </div>
      {/* Attendance message */}
      <p className={`mt-4 text-center font-medium ${presentPercentage > 85 ? "text-green-600" : "text-red-600"}`}>
        {message}
      </p>
    </div>
  );
};
