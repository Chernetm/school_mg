"use client";

import StudentResultCard from "@/components/StudentResultCard";
import React, { useEffect, useState } from "react";

export default function StudentPage() {
  const [student, setStudent] = useState(null);
  const [results, setResults] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/student/result");
      const data = await res.json();

      setStudent(data.student);
      setResults(data.results);
    }

    fetchData();
  }, []);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (!student || !results) return <p className="text-center">Loading...</p>;

  return (
    <div className="px-4 py-6">
      {/* Print button, hidden when printing */}
      <div className="mb-4 flex justify-end print:hidden">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Print Transcript
        </button>
      </div>

      <StudentResultCard student={student} results={results} />
    </div>
  );
}
