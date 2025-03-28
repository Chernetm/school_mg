const SelectField = ({ label, name, value, onChange, options }) => (
  <div className="flex flex-col w-full">
    <label className="font-semibold mb-1 text-gray-600">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="p-3 border rounded-lg bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-500"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
export default SelectField;