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
//       {Object.entries(results).map(([grade, semesters]) => (
//         <div key={grade} className="border p-4 rounded-xl shadow-md bg-white">
//           <h2 className="text-2xl font-bold text-gray-800 mb-6">{grade}</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {Object.entries(semesters).map(([semesterName, data]) => (
//               <div
//                 key={semesterName}
//                 className="border rounded-lg shadow-sm bg-gray-50 overflow-x-auto"
//               >
//                 <h3 className="text-lg font-semibold text-center bg-blue-100 text-blue-800 py-2 rounded-t-lg">
//                  Semester: {semesterName}
//                 </h3>
//                 <table className="w-full text-sm">
//                   <thead className="bg-blue-50 text-gray-700">
//                     <tr>
//                       <th className="border p-2">Subject</th>
//                       <th className="border p-2">Score</th>
//                     </tr>
//                   </thead>
//                   <tbody className="text-center text-gray-700">
//                     {Object.entries(data.scores || {}).map(
//                       ([subject, score], idx) => (
//                         <tr key={idx}>
//                           <td className="border p-2">{subject}</td>
//                           <td className="border p-2">{score}</td>
//                         </tr>
//                       )
//                     )}
//                   </tbody>
//                   <tfoot className="bg-gray-100 font-medium text-gray-800">
//                     <tr>
//                       <td className="border p-2">Average</td>
//                       <td className="border p-2 text-center">{data.average ?? "-"}</td>
//                     </tr>
//                     <tr>
//                       <td className="border p-2">Rank</td>
//                       <td className="border p-2 text-center">{data.rank ?? "-"}</td>
//                     </tr>
//                     <tr>
//                       <td className="border p-2">Status</td>
//                       <td
//                         className={`border p-2 text-center ${
//                           data.passStatus === "Passed"
//                             ? "text-green-600 font-semibold"
//                             : "text-red-500 font-semibold"
//                         }`}
//                       >
//                         {data.passStatus ?? "-"}
//                       </td>
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
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
        // Collect all subjects from both semesters
        const allSubjects = new Set([
          ...Object.keys(semesters["1"]?.scores || {}),
          ...Object.keys(semesters["2"]?.scores || {}),
        ]);

        return (
          <div key={grade} className="border p-4 rounded-xl shadow-md bg-white">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{grade}</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-300">
                <thead className="bg-blue-50 text-gray-700">
                  <tr>
                    <th className="border p-2">Subject</th>
                    <th className="border p-2">Semester 1</th>
                    <th className="border p-2">Semester 2</th>
                    <th className="border p-2">Average</th>
                  </tr>
                </thead>
                <tbody className="text-center text-gray-700">
                  {[...allSubjects].map((subject, idx) => {
                    const s1 = semesters["1"]?.scores?.[subject] ?? "-";
                    const s2 = semesters["2"]?.scores?.[subject] ?? "-";

                    let avg = "-";
                    if (!isNaN(s1) && !isNaN(s2)) {
                      avg = ((Number(s1) + Number(s2)) / 2).toFixed(1);
                    }

                    return (
                      <tr key={idx}>
                        <td className="border p-2 text-left">{subject}</td>
                        <td className="border p-2">{s1}</td>
                        <td className="border p-2">{s2}</td>
                        <td className="border p-2">{avg}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-100 font-medium text-gray-800">
                  <tr>
                    <td className="border p-2 text-left">Average</td>
                    <td className="border p-2">{semesters["1"]?.average ?? "-"}</td>
                    <td className="border p-2">{semesters["2"]?.average ?? "-"}</td>
                    <td className="border p-2">
                      {semesters["1"]?.average && semesters["2"]?.average
                        ? (
                            (Number(semesters["1"].average) +
                              Number(semesters["2"].average)) /
                            2
                          ).toFixed(1)
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2 text-left">Rank</td>
                    <td className="border p-2">{semesters["1"]?.rank ?? "-"}</td>
                    <td className="border p-2">{semesters["2"]?.rank ?? "-"}</td>
                    <td className="border p-2">-</td>
                  </tr>
                  <tr>
                    <td className="border p-2 text-left">Status</td>
                    <td
                      className={`border p-2 ${
                        semesters["1"]?.passStatus === "Passed"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {semesters["1"]?.passStatus ?? "-"}
                    </td>
                    <td
                      className={`border p-2 ${
                        semesters["2"]?.passStatus === "Passed"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {semesters["2"]?.passStatus ?? "-"}
                    </td>
                    <td className="border p-2">-</td>
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
