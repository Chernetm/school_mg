// 'use client';

// import UnpaidStudent from "@/components/UnpaidStudent";
// import { useState } from 'react';

// const grades = [9, 10, 11, 12];
// const years=[2018,2019,2020];

// export default function Page() {

//   const [selectedGrade, setSelectedGrade] = useState(11);
//   const [selectedYear, setSelectedYear] = useState(2018);

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
//           <label className="block font-medium text-sm mb-1">Select Year</label>
//           <select
//             value={selectedYear}
//             onChange={(e) => setSelectedYear(e.target.value)}
//             className="border rounded px-3 py-1"
//           >
//             {years.map((year) => (
//               <option key={h} value={year}>
//                 {year}
//               </option>
//             ))}
//           </select>
//         </div>
        
//       </div>

//       <UnpaidStudent
//         grade={selectedGrade}
//         year={selectedYear}
//       />
//     </div>
//   );
// }


'use client';

import UnpaidStudent from "@/components/UnpaidStudent";
import { useState } from 'react';
import { useTranslation } from '@/app/providers';

const grades = [9, 10, 11, 12];
const years = [2018, 2019, 2020, 2001, 2025];
const monthKeys = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Page() {
  const{ t } = useTranslation();
  const [selectedGrade, setSelectedGrade] = useState(11);
  const [selectedMonth, setSelectedMonth] = useState('April');
  const [selectedYear, setSelectedYear] = useState(2018);

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      {/* Dropdowns in horizontal flex */}
      <div className="flex flex-wrap gap-2">
        
        {/* Grade Selection */}
        <div className="flex-1 min-w-[100px]">
          <label className="block text-xs font-medium mb-1">Grade</label>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm"
          >
            {grades.map((grade) => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
        </div>

        {/* Month Selection */}
        <div className="flex-1 min-w-[120px]">
          <label className="block text-xs font-medium mb-1">Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm"
          >
            {monthKeys.map((monthKey) => (
              <option key={monthKey} value={monthKey}>
                {t(monthKey.toLowerCase())} {/* show translated label */}
              </option>
            ))}
          </select>
        </div>

        {/* Year Selection */}
        <div className="flex-1 min-w-[90px]">
          <label className="block text-xs font-medium mb-1">Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            className="w-full border rounded px-2 py-1 text-sm"
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Financial Summary */}
      <UnpaidStudent
        grade={selectedGrade}
        month={selectedMonth}
        year={selectedYear}
      />
    </div>
  );
}
