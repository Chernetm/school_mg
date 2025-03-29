import React from 'react';

export const CheckboxGroup = ({ label, options, selected, onChange }) => (
  options.length > 0 ? (
    <div className="mb-4">
      <label>{label}:</label>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {options.map((option) => (
          <label key={option.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selected.includes(option.id)}
              onChange={() => onChange(option.id)}
            />
            <span>{option.section}</span>
          </label>
        ))}
      </div>
    </div>
  ) : null
);
