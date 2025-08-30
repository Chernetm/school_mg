'use client';

import UnpaidStudent from "@/components/UnpaidStudent";
import { useState } from 'react';

const grades = [9, 10, 11, 12];
const years=[2018,2019,2020];

export default function Page() {

  const [selectedGrade, setSelectedGrade] = useState(11);
  const [selectedYear, setSelectedYear] = useState(2018);

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div>
          <label className="block font-medium text-sm mb-1">Select Grade</label>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(parseInt(e.target.value, 10))}
            className="border rounded px-3 py-1"
          >
            {grades.map((grade) => (
              <option key={grade} value={grade}>Grade {grade}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium text-sm mb-1">Select Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border rounded px-3 py-1"
          >
            {years.map((year) => (
              <option key={h} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        
      </div>

      <UnpaidStudent
        grade={selectedGrade}
        year={selectedYear}
      />
    </div>
  );
}


// 'use client';

// import UnpaidStudent from "@/components/UnpaidStudent";
// import { useState } from 'react';

// const grades = [9, 10, 11, 12];
// const months = [
//   'January', 'February', 'March', 'April', 'May', 'June',
//   'July', 'August', 'September', 'October', 'November', 'December',
// ];


// export default function Page() {
//   const currentYear = new Date().getFullYear();

//   const [selectedGrade, setSelectedGrade] = useState(11);
//   const [selectedMonth, setSelectedMonth] = useState('April');
//   const [selectedYear, setSelectedYear] = useState(currentYear);

//   return (
//     <div className="p-6 max-w-xl mx-auto space-y-4">
//       <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
//         <div>
//           <label className="block font-medium text-sm mb-1">Select Grade</label>
//           <select
//             value={selectedGrade}
//             onChange={(e) => setSelectedGrade(parseInt(e.target.value, 10))}
//             className="border rounded px-3 py-1"
//           >
//             {grades.map((grade) => (
//               <option key={grade} value={grade}>Grade {grade}</option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block font-medium text-sm mb-1">Select Month</label>
//           <select
//             value={selectedMonth}
//             onChange={(e) => setSelectedMonth(e.target.value)}
//             className="border rounded px-3 py-1"
//           >
//             {months.map((month) => (
//               <option key={month} value={month}>
//                 {month.charAt(0).toUpperCase() + month.slice(1).toLowerCase()}
//               </option>
//             ))}
//           </select>
//         </div>
        
//       </div>

//       <UnpaidStudent
//         grade={selectedGrade}
//         month={selectedMonth}
//         year={selectedYear}
//       />
//     </div>
//   );
// }
