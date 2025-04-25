"use client"

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

  if (!student || !results) return <p className="text-center">Loading...</p>;

  return <StudentResultCard student={student} results={results} />;
}
