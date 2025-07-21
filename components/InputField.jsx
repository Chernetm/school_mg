const InputField = ({ label, name, type = "text", value, onChange, required }) => {
  const handleInputChange = (e) => {
    let newValue = e.target.value;

    // Capitalize unless email or username
    if (!name.includes("email") && !name.includes("username")) {
      newValue = newValue.toUpperCase();
    }

    onChange(e, newValue);
  };

  return (
    <div className="flex flex-col w-full">
      <label className="font-semibold mb-1 text-gray-600">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleInputChange}
        className="p-3 border rounded-lg bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-500"
        required={required}
      />
    </div>
  );
};
export default InputField;