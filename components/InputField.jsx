 const  InputField = ({ label, name, type = "text", value, onChange, required }) => (
    <div className="flex flex-col w-full">
      <label className="font-semibold mb-1 text-gray-600">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="p-3 border rounded-lg bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-500"
        required={required}
      />
    </div>
  );
  export default InputField;