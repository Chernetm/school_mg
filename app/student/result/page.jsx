
// "use client";

// import { useEffect, useState } from "react";

// export default function StudentResults() {
//   const [results, setResults] = useState(null);

//   useEffect(() => {
//     fetch(`/api/student/result`)
//       .then((res) => res.json())
//       .then((data) => setResults(data.results));
//   }, []);

//   if (!results)
//     return <div className="text-center py-10 text-gray-600">Loading...</div>;

//   return (
//     <div className="space-y-10 px-4 sm:px-6 md:px-10 py-6 mt-10">
//       {Object.entries(results).map(([grade, semesters]) => {
//         const semesterKeys = Object.keys(semesters);
//         const allSubjects = new Set(
//           Object.values(semesters).flatMap((s) => Object.keys(s?.scores || {}))
//         );

//         return (
//           <div key={grade} className="border p-4 rounded-xl shadow-md bg-white">
//             <h2 className="text-2xl font-bold text-gray-800 mb-6">{grade}</h2>

//             <div className="overflow-x-auto">
//               <table className="w-full text-sm border border-gray-300">
//                 <thead className="bg-blue-50 text-gray-700">
//                   <tr>
//                     <th className="border p-2">Subject</th>
//                     {semesterKeys.map((semKey) => (
//                       <th key={semKey} className="border p-2">{semKey}</th>
//                     ))}
//                     <th className="border p-2">Average</th>
//                   </tr>
//                 </thead>
//                 <tbody className="text-center text-gray-700">
//                   {[...allSubjects].map((subject, idx) => {
//                     const subjectScores = semesterKeys.map(
//                       (semKey) => semesters[semKey]?.scores?.[subject]
//                     );

//                     const validScores = subjectScores.filter(
//                       (s) => typeof s === "number"
//                     );

//                     const avg =
//                       validScores.length > 0
//                         ? (
//                             validScores.reduce((sum, val) => sum + val, 0) /
//                             validScores.length
//                           ).toFixed(1)
//                         : "-";

//                     return (
//                       <tr key={idx}>
//                         <td className="border p-2 text-left">{subject}</td>
//                         {subjectScores.map((score, i) => (
//                           <td key={i} className="border p-2">
//                             {score ?? "-"}
//                           </td>
//                         ))}
//                         <td className="border p-2">{avg}</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//                 <tfoot className="bg-gray-100 font-medium text-gray-800">
//                   <tr>
//                     <td className="border p-2 text-left">Average</td>
//                     {semesterKeys.map((semKey) => (
//                       <td key={semKey} className="border p-2">
//                         {semesters[semKey]?.average ?? "-"}
//                       </td>
//                     ))}
//                     <td className="border p-2">
//                       {
//                         (() => {
//                           const averages = semesterKeys
//                             .map((k) => semesters[k]?.average)
//                             .filter((a) => typeof a === "number");
//                           return averages.length
//                             ? (
//                                 averages.reduce((sum, a) => sum + a, 0) /
//                                 averages.length
//                               ).toFixed(1)
//                             : "-";
//                         })()
//                       }
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border p-2 text-left">Rank</td>
//                     {semesterKeys.map((semKey) => (
//                       <td key={semKey} className="border p-2">
//                         {semesters[semKey]?.rank ?? "-"}
//                       </td>
//                     ))}
//                     <td className="border p-2">-</td>
//                   </tr>
//                   <tr>
//                     <td className="border p-2 text-left">Status</td>
//                     {semesterKeys.map((semKey) => (
//                       <td
//                         key={semKey}
//                         className={`border p-2 ${
//                           semesters[semKey]?.passStatus === "Passed"
//                             ? "text-green-600 font-semibold"
//                             : "text-red-500 font-semibold"
//                         }`}
//                       >
//                         {semesters[semKey]?.passStatus ?? "-"}
//                       </td>
//                     ))}
//                     <td className="border p-2">-</td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";

export default function StudentResults() {
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetch(`/api/student/result`)
      .then((res) => res.json())
      .then((data) => setResults(data.results));
  }, []);

  if (!results)
    return <div className="text-center py-10 text-gray-600">Loading...</div>;

  return (
    <div className="space-y-10 px-4 sm:px-6 md:px-10 py-6 mt-10">
      {Object.entries(results).map(([grade, semesters]) => {
        const semesterKeys = ["Semester 1", "Semester 2"];
        const allSubjects = new Set(
          semesterKeys.flatMap((semKey) =>
            Object.keys(semesters[semKey]?.scores || {})
          )
        );

        return (
          <div key={grade} className="border p-4 rounded-xl shadow-md bg-white">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{grade}</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-300">
                <thead className="bg-blue-50 text-gray-700">
                  <tr>
                    <th className="border p-2">Subject</th>
                    {semesterKeys.map((semKey) => (
                      <th key={semKey} className="border p-2">{semKey}</th>
                    ))}
                    <th className="border p-2">Average</th>
                  </tr>
                </thead>
                <tbody className="text-center text-gray-700">
                  {[...allSubjects].map((subject, idx) => {
                    const scores = semesterKeys.map(
                      (semKey) => semesters[semKey]?.scores?.[subject] ?? "-"
                    );

                    const validScores = scores.filter((s) => typeof s === "number");
                    const avg =
                      validScores.length > 0
                        ? (
                            validScores.reduce((sum, val) => sum + val, 0) /
                            validScores.length
                          ).toFixed(1)
                        : "-";

                    return (
                      <tr key={idx}>
                        <td className="border p-2 text-left">{subject}</td>
                        {scores.map((score, i) => (
                          <td key={i} className="border p-2">{score}</td>
                        ))}
                        <td className="border p-2">{avg}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-100 font-medium text-gray-800">
                  <tr>
                    <td className="border p-2 text-left">Average</td>
                    {semesterKeys.map((semKey) => (
                      <td key={semKey} className="border p-2">
                        {semesters[semKey]?.average ?? "-"}
                      </td>
                    ))}
                    <td className="border p-2">
                      {
                        (() => {
                          const avg1 = semesters["Semester 1"]?.average;
                          const avg2 = semesters["Semester 2"]?.average;
                          if (typeof avg1 === "number" && typeof avg2 === "number") {
                            return ((avg1 + avg2) / 2).toFixed(2);
                          }
                          return "-";
                        })()
                      }
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2 text-left">Rank</td>
                    {semesterKeys.map((semKey) => (
                      <td key={semKey} className="border p-2">
                        {semesters[semKey]?.rank ?? "-"}
                      </td>
                    ))}
                    <td className="border p-2">
                      {semesters["Semester 3"]?.rank ?? "-"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2 text-left">Status</td>
                    {semesterKeys.map((semKey) => (
                      <td key={semKey} className="border p-2 text-green-500">
                        {semesters[semKey]?.passStatus ?? "-"}
                      </td>
                    ))}
                    <td className="border p-2 text-green-500">
                      {semesters["Semester 3"]?.passStatus ?? "-"}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
