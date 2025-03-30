"use client"
import { useState } from "react";

export default function UpdateParentForm() {
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: ""
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const response = await fetch("/api/parent", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    if (response.ok) {
      setMessage("Parent information updated successfully");
    } else {
      setMessage(data.error || "Failed to update parent information");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 shadow-lg rounded-lg bg-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Update Parent Information</h2>
      {message && <p className="mb-2 text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" name="id" placeholder="Parent ID" value={formData.id} onChange={handleChange} className="w-full p-2 border rounded bg-white text-gray-900" required />
        <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="w-full p-2 border rounded bg-white text-gray-900" required />
        <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="w-full p-2 border rounded bg-white text-gray-900" required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded bg-white text-gray-900" required />
        <input type="password" name="password" placeholder="New Password (optional)" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded bg-white text-gray-900" />
        <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} className="w-full p-2 border rounded bg-white text-gray-900" />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded bg-white text-gray-900" />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Update</button>
      </form>
    </div>
  );
}
