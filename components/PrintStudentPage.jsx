"use client";

import React from 'react';
import StudentResultCard from './StudentResultCard';

const PrintTranscript = ({ students }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Print Button */}
      <div className="print:hidden mb-6 text-center">
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-lg"
        >
          Print All Transcripts
        </button>
      </div>

      {/* Student Cards */}
      <div className="space-y-6">
        {Array.isArray(students) && students.length > 0 ? (
          students.map((studentData) => (
            <div key={studentData.student.id} className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 print:page-break">
              <StudentResultCard student={studentData.student} results={studentData.results || []} />
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No student results available.</p>
        )}

      </div>
    </div>
  );
};

export default PrintTranscript;

