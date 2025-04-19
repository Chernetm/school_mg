// "use client";
// import React from "react";

// export default function ParentForm({ formData, onChange, onSubmit, submitLabel = "Submit", showIdField = false, message }) {
//   return (
//     <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
//       {message && <p className="text-sm text-red-600">{message}</p>}
//       <div className="grid grid-cols-2 gap-4">
//         {showIdField && (
//           <input className="p-3 border border-gray-300 rounded-md" type="text" name="id" placeholder="Parent ID" value={formData.id || ""} onChange={onChange} required />
//         )}
//         <input className="p-3 border border-gray-300 rounded-md" type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={onChange} required />
//         <input className="p-3 border border-gray-300 rounded-md" type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={onChange} required />
//         <input className="p-3 border border-gray-300 rounded-md" type="email" name="email" placeholder="Email" value={formData.email} onChange={onChange} required />
//         <input className="p-3 border border-gray-300 rounded-md" type="password" name="password" placeholder="Password" value={formData.password} onChange={onChange} />
//         <input className="p-3 border border-gray-300 rounded-md" type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={onChange} />
//         <input className="p-3 border border-gray-300 rounded-md" type="text" name="address" placeholder="Address" value={formData.address} onChange={onChange} />
//       </div>
//       <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition">
//         {submitLabel}
//       </button>
//     </form>
//   );
// }
"use client";
import InputField from "@/components/InputField"; // adjust path as needed
import React from "react";

export default function ParentForm({
  formData,
  onChange,
  onSubmit,
  submitLabel = "Submit",
  showIdField = false,
  message,
}) {
  // wrapper for handling overrideValue in InputField
  const handleFieldChange = (e, overrideValue = null) => {
    const value = overrideValue ?? e.target.value;
    const { name } = e.target;
    onChange({ target: { name, value } });
  };

  return (
    <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      {message && <p className="text-sm text-red-600">{message}</p>}
      <div className="grid grid-cols-2 gap-4">
        {showIdField && (
          <InputField
            label="Parent ID"
            name="id"
            type="text"
            value={formData.id || ""}
            onChange={handleFieldChange}
            required
          />
        )}
        <InputField
          label="First Name"
          name="firstName"
          type="text"
          value={formData.firstName}
          onChange={handleFieldChange}
          required
        />
        <InputField
          label="Last Name"
          name="lastName"
          type="text"
          value={formData.lastName}
          onChange={handleFieldChange}
          required
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleFieldChange}
          required
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleFieldChange}
        />
        <InputField
          label="Phone Number"
          name="phoneNumber"
          type="text"
          value={formData.phoneNumber}
          onChange={handleFieldChange}
        />
        <InputField
          label="Address"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleFieldChange}
        />
      </div>
      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition">
        {submitLabel}
      </button>
    </form>
  );
}
