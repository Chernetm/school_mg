"use client";
import React, { useState } from "react";

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
      section: "",
      image: null,
    },
    parent: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
    },
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [category, key] = name.split(".");
    setFormData((prev) => ({
      ...prev,
      [category]: { ...prev[category], [key]: value },
    }));
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

    try {
      validateFormData();

      const formDataToSend = new FormData();
      formDataToSend.append("student", JSON.stringify(formData.student));
      formDataToSend.append("parent", JSON.stringify(formData.parent));

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
      if (!response.ok) throw new Error(responseData.error || "Failed to register student.");

      setMessage("Student information saved successfully!");
      resetForm();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const validateFormData = () => {
    const { student } = formData;
    if (!student.firstName || !student.email || !student.age || !student.grade) {
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
        <Section title="Student Information">
          <StudentFields formData={formData.student} handleChange={handleChange} handleFileChange={handleFileChange} previewImage={previewImage} />
        </Section>
        <SubmitButton loading={loading} />
        {message && <p className="text-center mt-4">{message}</p>}
      </form>
    </div>
  );
};


export default StudentRegistrationForm;


// "use client";
// import Image from "next/image";
// import React, { useState } from "react";
// import InputField from "../../../components/InputField";

// const StudentRegistrationForm = () => {
//   const [formData, setFormData] = useState({
//     student: {
//       firstName: "",
//       middleName: "",
//       lastName: "",
//       age: "",
//       phoneNumber: "",
//       email: "",
//       year: "",
//       grade: "",
//       studentID: "",
//       stream: "",
//       section: "",
//       image: null, // Store the file here
//     },
//     parent: {
//       firstName: "",
//       lastName: "",
//       email: "",
//       phoneNumber: "",
//       address: "",
//     },
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null); // To show image preview

//   // Handle input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const [category, key] = name.split(".");
//     setFormData((prev) => ({
//       ...prev,
//       [category]: { ...prev[category], [key]: value },
//     }));
//   };

//   // Handle file change
//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0] || null;
//     if (file) {
//       setFormData((prev) => ({
//         ...prev,
//         student: { ...prev.student, image: file }, // Store the actual file
//       }));

//       // Show image preview
//       const reader = new FileReader();
//       reader.onload = () => {
//         setPreviewImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage(null);

//     try {
//       if (!formData.student.firstName || !formData.student.email || !formData.student.age || !formData.student.grade) {
//         throw new Error("Missing required fields.");
//       }

//       const formDataToSend = new FormData();

//       // Append student and parent data as JSON strings
//       formDataToSend.append("student", JSON.stringify(formData.student));
//       formDataToSend.append("parent", JSON.stringify(formData.parent));

//      // Append image file if available
// if (formData.student.image) {
//   formDataToSend.append("student.image", formData.student.image); // ✅ Match backend expectation
// } else {
//   throw new Error("Image is required for student registration.");
// }


//       const response = await fetch("/api/registrar/student", {
//         method: "POST",
//         body: formDataToSend,
//       });

//       const responseData = await response.json();

//       if (!response.ok) {
//         throw new Error(responseData.error || "Failed to register student.");
//       }

//       setMessage("Student and parent information saved successfully!");

//       // Reset form
//       setFormData({
//         student: {
//           firstName: "",
//           middleName: "",
//           lastName: "",
//           age: "",
//           phoneNumber: "",
//           email: "",
//           year: "",
//           grade: "",
//           studentID: "",
//           stream: "",
//           section: "",
//           image: null,
//         },
//         parent: {
//           firstName: "",
//           lastName: "",
//           email: "",
//           phoneNumber: "",
//           address: "",
//         },
//       });

//       setPreviewImage(null); // Clear image preview
//     } catch (error) {
//       setMessage(`Error: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <h2 className="text-lg font-semibold text-blue-500">Student Information</h2>
//         <div className="flex space-x-6">
//           <InputField label="First Name" name="student.firstName" type="text" value={formData.student.firstName} onChange={handleChange} />
//           <InputField label="Middle Name" name="student.middleName" type="text" value={formData.student.middleName} onChange={handleChange} />
//           <InputField label="Last Name" name="student.lastName" type="text" value={formData.student.lastName} onChange={handleChange} />
//         </div>

//         <div className="flex space-x-6">
//           <InputField label="Age" name="student.age" type="number" value={formData.student.age} onChange={handleChange} />
//           <InputField label="Phone Number" name="student.phoneNumber" type="text" value={formData.student.phoneNumber} onChange={handleChange} />
//           <InputField label="Email" name="student.email" type="email" value={formData.student.email} onChange={handleChange} />
//         </div>

//         <div className="flex space-x-6">
//           <InputField label="Grade" name="student.grade" type="text" value={formData.student.grade} onChange={handleChange} />
//           <InputField label="Year" name="student.year" type="number" value={formData.student.year} onChange={handleChange} />
//           <InputField label="Stream" name="student.stream" type="text" value={formData.student.stream} onChange={handleChange} />
//         </div>

//         <InputField label="Section" name="student.section" type="text" value={formData.student.section} onChange={handleChange} />
//         <InputField label="StudentID" name="student.studentID" type="text" value={formData.student.studentID} onChange={handleChange} />
//         {/* Image Upload */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Profile Image</label>
//           <input type="file" name="image" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
//           {previewImage && <Image src={previewImage} alt="Profile preview" width={128} height={128} className="rounded-full border mt-2" />}
//         </div>

//         {/* Parent Information */}
//         <h2 className="text-lg font-semibold text-blue-500">Parent Information</h2>
//         <div className="flex space-x-6">
//           <InputField label="First Name" name="parent.firstName" type="text" value={formData.parent.firstName} onChange={handleChange} />
//           <InputField label="Last Name" name="parent.lastName" type="text" value={formData.parent.lastName} onChange={handleChange} />
//         </div>

//         <div className="flex space-x-6">
//           <InputField label="Email" name="parent.email" type="email" value={formData.parent.email} onChange={handleChange} />
//           <InputField label="Phone Number" name="parent.phoneNumber" type="text" value={formData.parent.phoneNumber} onChange={handleChange} />
//           <InputField label="Address" name="parent.address" type="text" value={formData.parent.address} onChange={handleChange} />
//         </div>

//         <div className="flex justify-center mt-6">
//           <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700" disabled={loading}>
//             {loading ? "Submitting..." : "Submit"}
//           </button>
//         </div>

//         {message && <p className="text-center mt-4">{message}</p>}
//       </form>
//     </div>
//   );
// };

// export default StudentRegistrationForm;
