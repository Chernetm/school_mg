"use client";
import InputField from "@/components/InputField";
import { useState } from "react";

const StaffRegistrationForm = () => {
  const [formData, setFormData] = useState({
    staffID: "",
    firstName: "",
    middleName: "",
    lastName: "",
    phoneNumber: "",
    username: "",
    email: "",
    image: null,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const res = await fetch("/api/staff/register", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong!");

      setMessage("✅ Staff registered successfully!");
      setFormData({
        staffID: "",
        firstName: "",
        middleName: "",
        lastName: "",
        phoneNumber: "",
        username: "",
        email: "",
        image: null,
      });
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white text-gray-700 shadow-lg rounded-xl">
      <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">Staff Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {["staffID", "firstName", "middleName", "lastName", "phoneNumber", "username", "email"].map((field) => (
            <InputField
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required={field !== "middleName"}
            />
          ))}
           <div>
            <label className="block font-semibold mb-2 text-gray-600">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-green-500 hover:bg-green-400 transition rounded-lg text-white font-bold text-lg"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Register"}
        </button>

        {message && (
          <p className={`mt-4 text-center text-lg font-semibold ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default StaffRegistrationForm;
