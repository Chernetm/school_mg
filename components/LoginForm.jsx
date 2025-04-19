
"use client";
import { useState } from "react";

export default function LoginForm({ title, fields, onSubmit, icon }) {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, setError, setLoading);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
        {icon && <div className="mb-4">{icon}</div>}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {title}
        </h1>
        {error && (
          <p className="text-red-500 text-center font-medium mb-4">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="relative">
              {field.icon && (
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-400">
                  {field.icon}
                </span>
              )}
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                required
                className={`w-full py-2 pr-4 ${
                  field.icon ? "pl-10" : "pl-4"
                } border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
