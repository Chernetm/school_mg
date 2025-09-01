"use client";
import React from "react";

const StudentResultCard = ({ student, results }) => {
  const gradeOrder = ["Grade 9", "Grade 10", "Grade 11", "Grade 12"];
  const displaySemesters = ["Semester 1", "Semester 2"];
  const allSubjects = [
    "MATHAMATICS",
    "English",
    "History",
    "Geography",
    "Chemistry",
    "Physics",
    "Art",
    "Civic",
    "Biology",
    "IT",
  ];

  const columns = [];

  gradeOrder.forEach((grade) => {
    const semesters = results[grade] || {}; // always fallback to empty object

    // Semester columns
    displaySemesters.forEach((sem) => {
      columns.push({
        key: `${grade}-${sem}`,
        grade,
        label: sem === "Semester 1" ? "Sem |" : "Sem ||",
        // Force all subjects filled
        data: allSubjects.reduce((acc, subject) => {
          acc[subject] = semesters[sem]?.scores?.[subject] ?? "";
          return acc;
        }, {}),
        average: semesters[sem]?.average ?? "",
        rank: semesters[sem]?.rank ?? "",
        status: semesters[sem]?.passStatus ?? "",
      });
    });

    // Average column (between Sem 1 & Sem 2)
    const avgData = {};
    allSubjects.forEach((subject) => {
      const score1 = semesters["Semester 1"]?.scores?.[subject];
      const score2 = semesters["Semester 2"]?.scores?.[subject];

      if (typeof score1 === "number" && typeof score2 === "number") {
        avgData[subject] = ((score1 + score2) / 2).toFixed(2);
      } else if (typeof score1 === "number") {
        avgData[subject] = score1.toFixed(2);
      } else if (typeof score2 === "number") {
        avgData[subject] = score2.toFixed(2);
      } else {
        avgData[subject] = "";
      }
    });

    columns.push({
      key: `${grade}-Avg`,
      grade,
      label: "Avg",
      data: avgData,
      average: "", // yearly summary not provided by backend
      rank: "",
      status: "",
    });
  });

  const columnsByGrade = gradeOrder.map((grade) => ({
    grade,
    cols: columns.filter((c) => c.grade === grade),
  }));

  return (
    <div className="printable-area w-[794px] mx-auto p-8 bg-white border shadow-md text-[10px] font-sans leading-tight">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="w-20 h-20">
          <img
            src="/school-logo.png"
            alt="School Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="text-center flex-1">
          <h1 className="text-lg font-bold uppercase">Chelelektu Secondary School</h1>
          <p className="text-sm italic">Committed to Quality Education</p>
          <p className="text-[9px] mt-1">
            📧 Email: info@swa.edu.et | 📞 Phone: +251 900 000 000
          </p>
          <p className="text-[9px]">
            📍 Address: 1234 Addis Ababa, Ethiopia
          </p>
        </div>
        <div className="w-20 h-20" />
      </div>

      {/* Student Info */}
      <div className="flex justify-between mb-6 mt-4">
        <div className="text-[10px] space-y-1">
          <p><strong>Student’s Name:</strong> {student.firstName} {student.middleName} {student.lastName}</p>
          <p><strong>Sex:</strong> {student.gender}</p>
          <p><strong>Age:</strong> {student.age}</p>
          <p><strong>Nationality:</strong> Ethiopian</p>
          <p><strong>Stream:</strong> Natural Science</p>
        </div>
        <div className="flex flex-col items-center">
          <img
            src={student.image}
            alt="Student"
            className="w-24 h-28 object-cover border mb-1"
          />
          <div className="w-20 h-20 border rounded-full flex items-center justify-center text-xs text-gray-400">
            Stamp
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse text-[9px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-1 py-1 text-left" rowSpan={2}>Subject</th>
              {columnsByGrade.map(({ grade, cols }) => (
                <th key={grade} colSpan={cols.length} className="border px-1 py-1 text-center">{grade}</th>
              ))}
            </tr>
            <tr className="bg-gray-50">
              {columnsByGrade.map(({ cols }) =>
                cols.map((col) => (
                  <th key={col.key} className="border px-1 py-1 text-center">{col.label}</th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {allSubjects.map((subject) => (
              <tr key={subject}>
                <td className="border px-1 py-1">{subject}</td>
                {columnsByGrade.map(({ cols }) =>
                  cols.map((col) => (
                    <td key={col.key} className="border px-1 py-1 text-center">
                      {col.data[subject]}
                    </td>
                  ))
                )}
              </tr>
            ))}
          </tbody>
          <tfoot className="font-medium bg-gray-100">
            {["average", "rank", "status"].map((rowType) => (
              <tr key={rowType}>
                <td className="border px-1 py-1 text-left capitalize">{rowType}</td>
                {columnsByGrade.map(({ cols }) =>
                  cols.map((col) => (
                    <td
                      key={`${col.key}-${rowType}`}
                      className={`border px-1 py-1 text-center ${
                        rowType === "status"
                          ? col[rowType] === "passed"
                            ? "text-green-600"
                            : "text-red-600"
                          : ""
                      }`}
                    >
                      {col[rowType]}
                    </td>
                  ))
                )}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-8 flex justify-between text-[10px]">
        <div>
          <p><strong>Prepared by:</strong> _____________</p>
          <p className="mt-2">Signature: _____________</p>
        </div>
        <div>
          <p><strong>Director's Name:</strong> _____________</p>
          <p className="mt-2">Signature: _____________</p>
        </div>
      </div>

      <div className="text-center text-[9px] mt-4">
        <p><strong>Date of Issue:</strong> _____________</p>
      </div>
    </div>
  );
};

export default StudentResultCard;

// "use client";

// import React from "react";

// export default function StudentResultCard({ student, results }) {
//   const gradeOrder = ["Grade 9", "Grade 10", "Grade 11", "Grade 12"];
//   const displaySemesters = ["Semester 1", "Semester 2"];
//   const allSubjects = [
//     "Mathematics",
//     "English",
//     "History",
//     "Geography",
//     "Chemistry",
//     "Physics",
//     "Art",
//     "Civic",
//     "Biology",
//     "IT",
//   ];

//   // Build column config: 3 per grade (Sem I, Sem II, Avg = manual average)
//   const columns = [];
//   gradeOrder.forEach((grade) => {
//     const semesters = results[grade];
//     if (!semesters) return;
//     displaySemesters.forEach((sem) => {
//       columns.push({
//         key: `${grade}-${sem}`,
//         grade,
//         label: sem === "Semester 1" ? "Sem |" : sem === "Semester 2" ? "Sem ||" : sem,
//         data: semesters[sem]?.scores || {},
//         average: semesters[sem]?.average ?? "-",
//         rank: semesters[sem]?.rank ?? "-",
//         status: semesters[sem]?.passStatus ?? "-",
//       });
    
    


//     // displaySemesters.forEach((sem) => {
//     //   columns.push({
//     //     key: `${grade}-${sem}`,
//     //     grade,
//     //     label: sem,
//     //     data: semesters[sem]?.scores || {},
//     //     average: semesters[sem]?.average ?? "-",
//     //     rank: semesters[sem]?.rank ?? "-",
//     //     status: semesters[sem]?.passStatus ?? "-",
//     //   });
//     });

//     // Manual average per subject
//     const avgData = {};
//     allSubjects.forEach((subject) => {
//       const score1 = semesters["Semester 1"]?.scores?.[subject];
//       const score2 = semesters["Semester 2"]?.scores?.[subject];

//       if (typeof score1 === "number" && typeof score2 === "number") {
//         avgData[subject] = ((score1 + score2) / 2).toFixed(2);
//       } else if (typeof score1 === "number") {
//         avgData[subject] = score1.toFixed(2);
//       } else if (typeof score2 === "number") {
//         avgData[subject] = score2.toFixed(2);
//       } else {
//         avgData[subject] = "-";
//       }
//     });

//     columns.push({
//       key: `${grade}-Avg`,
//       grade,
//       label: "Avg",
//       data: avgData,
//       average: semesters["Semester 3"]?.average ?? "-",
//       rank: semesters["Semester 3"]?.rank ?? "-",
//       status: semesters["Semester 3"]?.passStatus ?? "-",
//     });
//   });

//   const columnsByGrade = gradeOrder
//     .map((grade) => {
//       const cols = columns.filter((c) => c.grade === grade);
//       return cols.length ? { grade, cols } : null;
//     })
//     .filter(Boolean);

//   return (
//     <div className="max-w-full px-4 py-6">
//       {/* Header */}
//       <div className="max-w-6xl mx-auto bg-white p-4 rounded-xl shadow mb-6 text-xs">
//         <div className="flex justify-between items-start border-b pb-3">
//           <div>
//             <h1 className="text-xl font-bold mb-1">Student Transcript</h1>
//             <p><strong>First Name:</strong> {student.firstName}</p>
//             <p><strong>Middle Name:</strong> {student.middleName}</p>
//             <p><strong>Last Name:</strong> {student.lastName}</p>
//             <p><strong>Age:</strong> {student.age}</p>
//             <p><strong>Sex:</strong> {student.gender}</p>
//           </div>
//           <img
//             src={student.image}
//             alt="Student"
//             className="w-24 h-28 object-cover rounded border"
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto max-w-full">
//         <table className="table-auto w-full border-collapse text-xs">
//           <thead>
//             {/* Grade Headers */}
//             <tr className="bg-gray-100">
//               <th className="border px-2 py-2 text-left" rowSpan={2}>
//                 Subject
//               </th>
//               {columnsByGrade.map(({ grade, cols }) => (
//                 <th
//                   key={grade}
//                   colSpan={cols.length}
//                   className="border px-2 py-2 text-center"
//                 >
//                   {grade}
//                 </th>
//               ))}
//             </tr>
//             {/* Semester Headers */}
//             <tr className="bg-gray-50">
//               {columnsByGrade.map(({ cols }) =>
//                 cols.map((col) => (
//                   <th key={col.key} className="border px-2 py-1 text-center">
//                     {col.label}
//                   </th>
//                 ))
//               )}
//             </tr>
//           </thead>

//           {/* Subject Scores */}
//           <tbody>
//             {allSubjects.map((subject) => (
//               <tr key={subject}>
//                 <td className="border px-2 py-1">{subject}</td>
//                 {columnsByGrade.map(({ cols }) =>
//                   cols.map((col) => (
//                     <td key={col.key} className="border px-2 py-1 text-center">
//                       {col.data[subject] ?? "-"}
//                     </td>
//                   ))
//                 )}
//               </tr>
//             ))}
//           </tbody>

//           {/* Footer: Avg, Rank, Status */}
//           <tfoot className="font-medium bg-gray-100">
//             {["average", "rank", "status"].map((rowType) => (
//               <tr key={rowType}>
//                 <td className="border px-2 py-1 text-left capitalize">
//                   {rowType}
//                 </td>
//                 {columnsByGrade.map(({ cols }) =>
//                   cols.map((col) => (
//                     <td
//                       key={`${col.key}-${rowType}`}
//                       className={`border px-2 py-1 text-center ${
//                         rowType === "status"
//                           ? col[rowType] === "passed"
//                             ? "text-green-600"
//                             : "text-red-600"
//                           : ""
//                       }`}
//                     >
//                       {col[rowType]}
//                     </td>
//                   ))
//                 )}
//               </tr>
//             ))}
//           </tfoot>
//         </table>
//       </div>
//     </div>
//   );
// }




// "use client";
// import React from "react";

// const StudentResultCard = ({ student, results }) => {
//   const gradeOrder = ["Grade 9", "Grade 10", "Grade 11", "Grade 12"];
//   const displaySemesters = ["Semester 1", "Semester 2"];
//   const allSubjects = [
//     "Mathematics",
//     "English",
//     "History",
//     "Geography",
//     "Chemistry",
//     "Physics",
//     "Art",
//     "Civic",
//     "Biology",
//     "IT",
//   ];
// const columns = [];

// gradeOrder.forEach((grade) => {
//   const semesters = results[grade] || {}; // ensure empty object if no data

//   displaySemesters.forEach((sem) => {
//     columns.push({
//       key: `${grade}-${sem}`,
//       grade,
//       label: sem === "Semester 1" ? "Sem |" : "Sem ||",
//       data: semesters[sem]?.scores || {},   // scores if exist, else empty
//       average: semesters[sem]?.average ?? "-",
//       rank: semesters[sem]?.rank ?? "-",
//       status: semesters[sem]?.passStatus ?? "-",
//     });
//   });

//   // Average column
//   const avgData = {};
//   allSubjects.forEach((subject) => {
//     const score1 = semesters["Semester 1"]?.scores?.[subject];
//     const score2 = semesters["Semester 2"]?.scores?.[subject];

//     if (typeof score1 === "number" && typeof score2 === "number") {
//       avgData[subject] = ((score1 + score2) / 2).toFixed(2);
//     } else if (typeof score1 === "number") {
//       avgData[subject] = score1.toFixed(2);
//     } else if (typeof score2 === "number") {
//       avgData[subject] = score2.toFixed(2);
//     } else {
//       avgData[subject] = "-";
//     }
//   });

//   columns.push({
//     key: `${grade}-Avg`,
//     grade,
//     label: "Avg",
//     data: avgData,
//     average: "-", // or compute yearly if available
//     rank: "-",
//     status: "-",
//   });
// });


//   const columnsByGrade = gradeOrder
//     .map((grade) => {
//       const cols = columns.filter((c) => c.grade === grade);
//       return cols.length ? { grade, cols } : null;
//     })
//     .filter(Boolean);

//   return (
//     <div className="printable-area w-[794px] mx-auto p-8 bg-white border shadow-md text-[10px] font-sans leading-tight">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <div className="w-20 h-20">
//           <img
//             src="/school-logo.png"
//             alt="School Logo"
//             className="w-full h-full object-contain"
//           />
//         </div>
//         <div className="text-center flex-1">
//           <h1 className="text-lg font-bold uppercase">Chelelektu Secondary School</h1>
//           <p className="text-sm italic">Committed to Quality Education</p>
//           <p className="text-[9px] mt-1">
//             📧 Email: info@swa.edu.et | 📞 Phone: +251 900 000 000
//           </p>
//           <p className="text-[9px]">
//             📍 Address: 1234 Addis Ababa, Ethiopia
//           </p>
//         </div>
//         <div className="w-20 h-20" />
//       </div>

//       {/* Student Info */}
//       <div className="flex justify-between mb-6 mt-4">
//         <div className="text-[10px] space-y-1">
//           <p><strong>Student’s Name:</strong> {student.firstName} {student.middleName} {student.lastName}</p>
//           <p><strong>Sex:</strong> {student.gender}</p>
//           <p><strong>Age:</strong> {student.age}</p>
//           <p><strong>Nationality:</strong> Ethiopian</p>
//           <p><strong>Stream:</strong> Natural Science</p>
//         </div>
//         <div className="flex flex-col items-center">
//           <img
//             src={student.image}
//             alt="Student"
//             className="w-24 h-28 object-cover border mb-1"
//           />
//           <div className="w-20 h-20 border rounded-full flex items-center justify-center text-xs text-gray-400">
//             Stamp
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="table-auto w-full border-collapse text-[9px]">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border px-1 py-1 text-left" rowSpan={2}>Subject</th>
//               {columnsByGrade.map(({ grade, cols }) => (
//                 <th key={grade} colSpan={cols.length} className="border px-1 py-1 text-center">{grade}</th>
//               ))}
//             </tr>
//             <tr className="bg-gray-50">
//               {columnsByGrade.map(({ cols }) =>
//                 cols.map((col) => (
//                   <th key={col.key} className="border px-1 py-1 text-center">{col.label}</th>
//                 ))
//               )}
//             </tr>
//           </thead>
//           <tbody>
//             {allSubjects.map((subject) => (
//               <tr key={subject}>
//                 <td className="border px-1 py-1">{subject}</td>
//                 {columnsByGrade.map(({ cols }) =>
//                   cols.map((col) => (
//                     <td key={col.key} className="border px-1 py-1 text-center">
//                       {col.data[subject] ?? "-"}
//                     </td>
//                   ))
//                 )}
//               </tr>
//             ))}
//           </tbody>
//           <tfoot className="font-medium bg-gray-100">
//             {["average", "rank", "status"].map((rowType) => (
//               <tr key={rowType}>
//                 <td className="border px-1 py-1 text-left capitalize">{rowType}</td>
//                 {columnsByGrade.map(({ cols }) =>
//                   cols.map((col) => (
//                     <td
//                       key={`${col.key}-${rowType}`}
//                       className={`border px-1 py-1 text-center ${
//                         rowType === "status"
//                           ? col[rowType] === "passed"
//                             ? "text-green-600"
//                             : "text-red-600"
//                           : ""
//                       }`}
//                     >
//                       {col[rowType]}
//                     </td>
//                   ))
//                 )}
//               </tr>
//             ))}
//           </tfoot>
//         </table>
//       </div>

//       {/* Footer */}
//       <div className="mt-8 flex justify-between text-[10px]">
//         <div>
//           <p><strong>Prepared by:</strong> _____________</p>
//           <p className="mt-2">Signature: _____________</p>
//         </div>
//         <div>
//           <p><strong>Director's Name:</strong> _____________</p>
//           <p className="mt-2">Signature: _____________</p>
//         </div>
//       </div>

//       <div className="text-center text-[9px] mt-4">
//         <p><strong>Date of Issue:</strong> _____________</p>
//       </div>
//     </div>
//   );
// };


// export default StudentResultCard;
