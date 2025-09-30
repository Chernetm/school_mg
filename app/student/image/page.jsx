"use client";

import { useState } from "react";
import { UploadCloud, AlertCircle, CheckCircle } from "lucide-react";

export default function Grade12ImageUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setError("");
    setSuccess("");

    if (!selected) return;

    if (!allowedTypes.includes(selected.type)) {
      setError("Unsupported image format (JPEG, PNG, WEBP only).");
      return;
    }

    if (selected.size > maxSize) {
      setError("Image size exceeds 5MB.");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/student/image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Upload failed");

      setSuccess("Image uploaded successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Header Message */}
      <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md flex items-center gap-2 mb-4 text-sm">
        <AlertCircle className="w-5 h-5" />
        <span>
          This works for Grade 12 students only. If you have any other
          condition, please visit the registrar.
        </span>
      </div>

      {/* Upload Area */}
      <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-400">
        <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
        <span className="text-gray-600 text-sm text-center">
          Click or drag to upload an image
        </span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {/* Preview */}
      {preview && (
        <div className="mt-4 flex justify-center">
          <img
            src={preview}
            alt="Preview"
            className="w-40 h-40 sm:w-48 sm:h-48 object-cover rounded-md border"
          />
        </div>
      )}

      {/* Error / Success */}
      {error && (
        <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {success && (
        <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle className="w-4 h-4" /> {success}
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50 text-sm"
        disabled={!file}
      >
        Upload Image
      </button>

      {/* Rules */}
      <p className="mt-2 text-gray-500 text-xs text-center">
        Allowed formats: JPEG, PNG, WEBP. Max size: 5MB.
      </p>
    </div>
  );
}
