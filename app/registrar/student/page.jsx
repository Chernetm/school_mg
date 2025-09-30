
"use client";
import React, { useState } from "react";
import { Section } from "@/components/Section";
import { StudentFields } from "@/components/StudentFields";
import LoadingButton from "@/components/LoadingButton";
import Spinner from "@/components/Loading/Spinner/page";

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

    // Append image only if it exists
    if (formData.student.image) {
      formDataToSend.append("student.image", formData.student.image);
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setMessage(null);
  //   setIsError(false);

  //   try {
  //     validateFormData();

  //     const trimmedStudent = trimObjectStrings(formData.student);

  //     const formDataToSend = new FormData();
  //     formDataToSend.append("student", JSON.stringify(trimmedStudent));

  //     if (formData.student.image) {
  //       formDataToSend.append("student.image", formData.student.image);
  //     } else {
  //       throw new Error("Image is required for student registration.");
  //     }

  //     const response = await fetch("/api/registrar/student", {
  //       method: "POST",
  //       body: formDataToSend,
  //     });

  //     const responseData = await response.json();

  //     if (!response.ok) {
  //       const errorMsg = responseData?.error || "Something went wrong.";
  //       throw new Error(errorMsg);
  //     }

  //     setMessage("✅ Student information saved successfully!");
  //     resetForm();
  //   } catch (error) {
  //     console.error("🚨 Submission error:", error);
  //     setIsError(true);
  //     setMessage(`❌ ${error.message}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const validateFormData = () => {
    const { student } = formData;
    if (!student.firstName || !student.email || !student.age || !student.grade ||
      !student.gender  || !student.studentID || !student.year ||
      !student.stream || !student.phoneNumber || !student.middleName || !student.lastName) {
      throw new Error("Missing required fields.");
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setPreviewImage(null);
  };

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

          {/* Gender Radio Buttons (full width row) */}

        </Section>


        <LoadingButton
          loading={loading}
          text="Register"
          loadingText="Registering student ..."
        />
        {message && (
          <p
            className={`text-center mt-4 text-sm font-medium ${isError ? "text-red-600" : "text-green-600"
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
