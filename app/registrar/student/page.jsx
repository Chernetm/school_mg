
"use client";
import React, { useState } from "react";

import UploadingSpinner from "@/components/Loading/Uploading/page";
import { Section } from "@/components/Section";
import { StudentFields } from "@/components/StudentFields";
import { SubmitButton } from "@/components/SubmitButton";

const StudentRegistrationForm = () => {
  const initialFormData = {
    student: {
      firstName: "",
      middleName: "",
      lastName: "",
      age: "",
      phoneNumber: "",
      email: "",
      year: "",
      grade: "",
      studentID: "",
      stream: "",
      gender: "",
      image: null,
    }
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e, overrideValue = null) => {
    const { name } = e.target;
    let value = overrideValue ?? e.target.value;
    const [category, key] = name.split(".");

    if (key !== "email" && key !== "username" && typeof value === "string") {
      value = value.toUpperCase();
    }

    setFormData((prev) => ({
      ...prev,
      [category]: { ...prev[category], [key]: value },
    }));
  };

  const trimObjectStrings = (obj) => {
    const trimmed = {};
    for (const key in obj) {
      const value = obj[key];
      trimmed[key] = typeof value === "string" ? value.trim() : value;
    }
    return trimmed;
  };
  

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormData((prev) => ({
        ...prev,
        student: { ...prev.student, image: file },
      }));

      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setIsError(false);
  
    try {
      validateFormData();
  
      const trimmedStudent = trimObjectStrings(formData.student);
  
      const formDataToSend = new FormData();
      formDataToSend.append("student", JSON.stringify(trimmedStudent));
  
      if (formData.student.image) {
        formDataToSend.append("student.image", formData.student.image);
      } else {
        throw new Error("Image is required for student registration.");
      }
  
      const response = await fetch("/api/registrar/student", {
        method: "POST",
        body: formDataToSend,
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        const errorMsg = responseData?.error || "Something went wrong.";
        throw new Error(errorMsg);
      }
  
      setMessage("✅ Student information saved successfully!");
      resetForm();
    } catch (error) {
      console.error("🚨 Submission error:", error);
      setIsError(true);
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const validateFormData = () => {
    const { student } = formData;
    if (!student.firstName || !student.email || !student.age || !student.grade ||
       !student.gender|| !student.image || !student.studentID|| !student.year|| 
       !student.stream|| !student.phoneNumber|| !student.middleName|| !student.lastName) {
      throw new Error("Missing required fields.");
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setPreviewImage(null);
  };


 if (loading) {
     return (
       <div className="flex justify-center items-center min-h-screen">
         <UploadingSpinner />
       </div>
     );
   }
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Student Info Section */}
        <Section title="Student Information">
          <StudentFields
            formData={formData.student}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            previewImage={previewImage}
          />

          {/* Gender Radio Buttons */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">Gender</label>
            <div className="flex gap-4">
              {["MALE", "FEMALE"].map((genderOption) => (
                <label
                  key={genderOption}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer border 
                    ${formData.student.gender === genderOption
                      ? "bg-blue-100 border-blue-500 text-blue-700"
                      : "bg-white border-gray-300 text-gray-700"
                    } transition`}
                >
                  <input
                    type="radio"
                    name="student.gender"
                    value={genderOption}
                    checked={formData.student.gender === genderOption}
                    onChange={(e) => handleChange(e, genderOption)}
                    className="hidden"
                  />
                  {genderOption}
                </label>
              ))}
            </div>
          </div>
        </Section>

        {/* Submit */}
        <SubmitButton loading={loading} />

        {message && (
          <p
            className={`text-center mt-4 text-sm font-medium ${
              isError ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default StudentRegistrationForm;
