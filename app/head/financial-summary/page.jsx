

'use client';

import FinancialSummary from '@/components/FinancialSummary';
import { useState } from 'react';
import { useTranslation } from '@/app/providers';

const grades = [9,10,11,12];
const years = [2018, 2019, 2020, 2001, 2022, 2023,2024, 2025];

// fixed English month keys (values sent to backend)
const monthKeys = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Finance() {
  const [selectedGrade, setSelectedGrade] = useState("1");
  const [selectedMonth, setSelectedMonth] = useState('April');
  const [selectedYear, setSelectedYear] = useState(2018);

  const { t } = useTranslation();

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
      <FinancialSummary
        grade={selectedGrade}
        month={selectedMonth}   // always English
        year={selectedYear}
      />
    </div>
  );
}
