import React from 'react';

export const Dropdown = ({ label, options, onChange }) => (
  <label className="block mb-4">
    {label}:
    <select required onChange={(e) => onChange(Number(e.target.value))}>
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>{option.name}</option>
      ))}
    </select>
  </label>
);
