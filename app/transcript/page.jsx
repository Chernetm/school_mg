"use client";

import PrintTranscript from "@/components/PrintStudentPage";
import React, { useEffect, useState } from "react";

export default function StudentPage() {
  const [student, setStudent] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/student/result");
        const data = await res.json();
        setStudent(data.student);
        setResults(data.results);
      } catch (error) {
        console.error("Failed to fetch student data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

 

  if (loading) return <p>Loading...</p>;
  if (!student || !results) return <p>No student data found.</p>;

  return (
    <div className="p-4">
      <PrintTranscript  student={student} results={results} />
    </div>
  );
}
