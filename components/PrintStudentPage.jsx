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
        {students.map((studentData) => (
          <div key={studentData.student.id} className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 print:page-break">
            <StudentResultCard student={studentData.student} results={studentData.results} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrintTranscript;


// "use client";
// import React from 'react';
// import StudentResultCard from './StudentResultCard'; // Adjust the import path

// const PrintTranscript = ({ student, results }) => {
//   const handlePrint = () => {
//     window.print();
//   };

//   return (
//     <div>
//       <div className="hidden print:block">
//         <StudentResultCard student={student} results={results} />
//       </div>
      
//       {/* Preview area (visible only on screen) */}
//       <div className="print:hidden">
//         <div className="mb-4">
//           <button 
//             onClick={handlePrint}
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//           >
//             Print Transcript
//           </button>
//         </div>
//         <StudentResultCard student={student} results={results} />
//       </div>
//     </div>
//   );
// };

// export default PrintTranscript;