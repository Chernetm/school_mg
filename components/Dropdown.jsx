"use client";

import React from "react";
import { useTranslation } from "@/app/providers"; // ✅ import our translation hook

export const Dropdown = ({ label, options, onChange }) => {
  const { t } = useTranslation();

  return (
    <label className="block mb-4">
      {t(label)}:
      <select
        required
        onChange={(e) => onChange(Number(e.target.value))}
        className="ml-2 p-2 border rounded"
      >
        <option value="">{t("select")} {t(label)}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </label>
  );
};



// import React from 'react';

// export const Dropdown = ({ label, options, onChange }) => (
//   <label className="block mb-4">
//     {label}:
//     <select required onChange={(e) => onChange(Number(e.target.value))}>
//       <option value="">Select {label}</option>
//       {options.map((option) => (
//         <option key={option.id} value={option.id}>{option.name}</option>
//       ))}
//     </select>
//   </label>
// );
