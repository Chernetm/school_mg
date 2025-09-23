// 'use client';

// import { useEffect, useState } from 'react';

// export default function UnpaidStudents({ grade, year }) {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUnpaid = async () => {
//       setLoading(true);
//       const res = await fetch(`/api/head/unpaid-student?grade=${grade}&year=${year}`);
//       const data = await res.json();
//       setStudents(data);
//       setLoading(false);
//     };

//     fetchUnpaid();
//   }, [grade,year]);

//   const exportToCSV = () => {
//     const headers = ['Student ID', 'First Name', 'Last Name', 'Section', 'Grade'];
//     const rows = students.map(s => [s.studentID, s.firstName, s.lastName, s.section, s.grade]);

//     let csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', `Unpaid_Students_Grade${grade}_${month}_${year}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-semibold">
//           Unpaid Students - Grade {grade}, {year}
//         </h2>
//         <button
//           onClick={exportToCSV}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Export to CSV
//         </button>
//       </div>

//       {loading ? (
//         <p>Loading...</p>
//       ) : students.length === 0 ? (
//         <p>No unpaid students found.</p>
//       ) : (
//         <div className="overflow-x-auto border rounded">
//           <table className="min-w-full text-sm text-left table-auto">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-4 py-2">Student ID</th>
//                 <th className="px-4 py-2">First Name</th>
//                 <th className="px-4 py-2">Middle Name</th>
//                 <th className="px-4 py-2">Last Name</th>
//                 <th className="px-4 py-2">Section</th>
//                 <th className="px-4 py-2">Grade</th>
//               </tr>
//             </thead>
//             <tbody>
//               {students.map((s, i) => (
//                 <tr key={i} className="border-t">
//                   <td className="px-4 py-2">{s.studentID}</td>
//                   <td className="px-4 py-2">{s.firstName}</td>
//                   <td className="px-4 py-2">{s.middleName}</td>
//                   <td className="px-4 py-2">{s.lastName}</td>
//                   <td className="px-4 py-2">{s.section}</td>
//                   <td className="px-4 py-2">{s.grade}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }







'use client';

import { useEffect, useState } from 'react';

export default function UnpaidStudents({ grade, month, year }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnpaid = async () => {
      setLoading(true);
      const res = await fetch(`/api/head/unpaid-student?grade=${grade}&month=${month}&year=${year}`);
      const data = await res.json();
      setStudents(data);
      setLoading(false);
    };

    fetchUnpaid();
  }, [grade, month, year]);

  const exportToCSV = () => {
    const headers = ['Student ID', 'First Name', 'Last Name', 'Section', 'Grade'];
    const rows = students.map(s => [s.studentID, s.firstName, s.lastName, s.section, s.grade]);

    let csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Unpaid_Students_Grade${grade}_${month}_${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">
          Unpaid Students - Grade {grade}, {month} {year}
        </h2>
        <button
          onClick={exportToCSV}
          className="bg-blue-600 text-white px-2 py-2 rounded hover:bg-blue-700"
        >
          Print
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : students.length === 0 ? (
        <p>No unpaid students found.</p>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-sm text-left table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Student ID</th>
                <th className="px-4 py-2">First Name</th>
                <th className="px-4 py-2">Last Name</th>
                <th className="px-4 py-2">Section</th>
                <th className="px-4 py-2">Grade</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2">{s.studentID}</td>
                  <td className="px-4 py-2">{s.firstName}</td>
                  <td className="px-4 py-2">{s.lastName}</td>
                  <td className="px-4 py-2">{s.section}</td>
                  <td className="px-4 py-2">{s.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
