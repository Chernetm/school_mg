"use client"
import LoadingButton from "@/components/LoadingButton";
import { useEffect, useState } from "react";

export default function YearManager() {
  const [years, setYears] = useState([]);
  const [year, setYear] = useState("");
  const [status, setStatus] = useState("active");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchYears();
  }, []);

  const fetchYears = async () => {
    try {
      const res = await fetch("/api/head/year");
      const data = await res.json();
      setYears(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching years:", error);
      setYears([]);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/head/year", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: parseInt(year), status })
      });
      if (res.ok) {
        setMessage("Year added successfully");
        fetchYears();
      }

    }
    catch (error) {
      setMessage("Error adding year", error);
    } finally {
      setLoading(false)
    }
  };

  const handleDelete = async (id) => {
    await fetch("/api/head/year", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    fetchYears();
  };

  const handleStatusUpdate = async (id, newStatus) => {
    await fetch("/api/head/year", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus })
    });
    fetchYears();
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-gray-100 shadow-lg rounded-lg text-gray-800">
      <h2 className="text-xl font-semibold mb-4">Manage Years</h2>
      {message && <p className="text-green-600">{message}</p>}

      <form onSubmit={handleCreate} className="mb-4">
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full p-2 border rounded mb-2 bg-white text-gray-800"
          required
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded mb-2 bg-white text-gray-800"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <LoadingButton
          loading={loading}
          text="Login"
          loadingText="Registering year ..."
        />

      </form>

      <ul className="space-y-2">
        {years.length > 0 ? (
          years.map((yr) => (
            <li key={yr.id} className="p-2 border rounded flex justify-between items-center bg-white text-gray-800">
              <span>Year {yr.year} - {yr.status}</span>
              <div>
                <button
                  onClick={() =>
                    handleStatusUpdate(yr.id, yr.status === "active" ? "inactive" : "active")
                  }
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                >
                  Toggle Status
                </button>
                <button
                  onClick={() => handleDelete(yr.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-600">No years found.</p>
        )}
      </ul>
    </div>
  );
}
