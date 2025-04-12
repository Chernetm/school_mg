"use client";
import React from "react";

export default function ParentForm({ formData, onChange, onSubmit, submitLabel = "Submit", showIdField = false, message }) {
  return (
    <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      {message && <p className="text-sm text-red-600">{message}</p>}
      <div className="grid grid-cols-2 gap-4">
        {showIdField && (
          <input className="p-3 border border-gray-300 rounded-md" type="text" name="id" placeholder="Parent ID" value={formData.id || ""} onChange={onChange} required />
        )}
        <input className="p-3 border border-gray-300 rounded-md" type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={onChange} required />
        <input className="p-3 border border-gray-300 rounded-md" type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={onChange} required />
        <input className="p-3 border border-gray-300 rounded-md" type="email" name="email" placeholder="Email" value={formData.email} onChange={onChange} required />
        <input className="p-3 border border-gray-300 rounded-md" type="password" name="password" placeholder="Password" value={formData.password} onChange={onChange} />
        <input className="p-3 border border-gray-300 rounded-md" type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={onChange} />
        <input className="p-3 border border-gray-300 rounded-md" type="text" name="address" placeholder="Address" value={formData.address} onChange={onChange} />
      </div>
      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition">
        {submitLabel}
      </button>
    </form>
  );
}
