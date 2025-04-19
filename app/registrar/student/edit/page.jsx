// "use client";

// import Image from "next/image";
// import { useState } from "react";

// export default function EditStudent() {
//   const [studentID, setStudentID] = useState("");
//   const [student, setStudent] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [updating, setUpdating] = useState(false);
//   const [image, setImage] = useState(null);
//   const [password, setPassword] = useState("");

//   const handleFetchStudent = async () => {
//     if (!studentID) return alert("Please enter a student ID");
  
//     setLoading(true);
    
//     try {
//       const response = await fetch(`/api/registrar/student/edit/${studentID}`);
  
//       if (!response.ok) {
//         throw new Error("Failed to fetch student");
//       }
  
//       const data = await response.json();
//       console.log("Student Data:", data); // Debugging
//       setStudent(data);
//     } catch (err) {
//       console.error("Error fetching student:", err);
//       alert("Error fetching student");
//     }
  
//     setLoading(false);
//   };
  
//   const handleChange = (e) => {
//     const { name, value } = e.target;
  
//     // Don't capitalize email fields
//     const newValue = !name.toLowerCase().includes("email") ? value.toUpperCase() : value;
  
//     setStudent((prev) => (prev ? { ...prev, [name]: newValue } : null));
//   };
  

//   const handleImageChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setImage(e.target.files[0]);
//     }
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!student || !studentID) return alert("No student data available.");
  
//     setUpdating(true);
//     try {
//       const formData = new FormData();
//       Object.keys(student).forEach((key) => {
//         const value = student[key];
//         if (value !== undefined && value !== "") {
//           formData.append(key, String(value));
//         }
//       });
  
//       if (image) {
//         formData.append("image", image);
//       }
  
//       if (password) {
//         console.log("🔹 Sending plain password:", password); // Debugging
//         formData.append("password", password); // Ensure it's sent as raw text
//       }
  
//       const response = await fetch(`/api/registrar/student/edit/${studentID}`, {
//         method: "PUT",
//         body: formData,
//       });
  
//       if (!response.ok) throw new Error("Failed to update student");
  
//       alert("Student updated successfully!");
//     } catch (err) {
//       console.error("❌ Error updating student:", err);
//       alert("Failed to update student");
//     }
//     setUpdating(false);
//   };
  

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="mb-6 bg-white p-4 rounded shadow">
//         <label className="block mb-2 text-gray-700 font-semibold">Enter Student ID:</label>
//         <input
//           type="number"
//           value={studentID}
//           onChange={(e) => setStudentID(e.target.value ? e.target.value : "")}
//           className="border p-2 w-full rounded bg-white text-black"
//         />
//         <button
//           onClick={handleFetchStudent}
//           disabled={loading}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mt-3 rounded shadow"
//         >
//           {loading ? "Fetching..." : "Fetch Student"}
//         </button>
//       </div>

//       {student && (
//         <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
//           <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Student Information</h2>
//           <div className="grid grid-cols-2 gap-4">
//             <input name="firstName" value={student.firstName} onChange={handleChange} className="border p-2 rounded bg-white text-black" placeholder="First Name" />
//             <input name="middleName" value={student.middleName || ""} onChange={handleChange} className="border p-2 rounded bg-white text-black" placeholder="Middle Name" />
//             <input name="lastName" value={student.lastName} onChange={handleChange} className="border p-2 rounded bg-white text-black" placeholder="Last Name" />
//             <input name="age" type="number" value={student.age} onChange={handleChange} className="border p-2 rounded bg-white text-black" placeholder="Age" />
//             <input name="phoneNumber" value={student.phoneNumber} onChange={handleChange} className="border p-2 rounded bg-white text-black" placeholder="Phone Number" />
//             <input name="email" type="email" value={student.email} onChange={handleChange} className="border p-2 rounded bg-white text-black" placeholder="Email" />
//             <input name="grade" type="number" value={student.grade} onChange={handleChange} className="border p-2 rounded bg-white text-black" placeholder="Grade" />
            
//           </div>

//           <div className="mt-4">
//             <label className="block mb-2 text-gray-700 font-semibold">Profile Image:</label>
//             <input type="file" accept="image/*" onChange={handleImageChange} className="border p-2 w-full rounded bg-white text-black" />
//             {image && (
//               <Image src={URL.createObjectURL(image)} alt="Preview" width={96} height={96} className="mt-2 object-cover rounded" />
//             )}
//           </div>

//           <div className="mt-4">
//             <label className="block mb-2 text-gray-700 font-semibold">New Password (Optional):</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="border p-2 w-full rounded bg-white text-black"
//               placeholder="Enter new password"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={updating}
//             className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 mt-4 rounded shadow"
//           >
//             {updating ? "Updating..." : "Update Student"}
//           </button>
//         </form>
//       )}
//     </div>
//   );
// }


"use client";

import Image from "next/image";
import { useState } from "react";

export default function EditStudent() {
  const [studentID, setStudentID] = useState("");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [image, setImage] = useState(null);
  const [password, setPassword] = useState("");

  const handleFetchStudent = async () => {
    if (!studentID) return alert("Please enter a student ID");

    setLoading(true);

    try {
      const response = await fetch(`/api/registrar/student/edit/${studentID}`);

      if (!response.ok) {
        throw new Error("Failed to fetch student");
      }

      const data = await response.json();
      console.log("Student Data:", data);
      setStudent(data);
    } catch (err) {
      console.error("Error fetching student:", err);
      alert("Error fetching student");
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Don't capitalize email fields
    const newValue = !name.toLowerCase().includes("email") ? value.toUpperCase() : value;
  
    setStudent((prev) => (prev ? { ...prev, [name]: newValue } : null));
  };
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!student || !studentID) return alert("No student data available.");

    setUpdating(true);
    try {
      const formData = new FormData();
      Object.keys(student).forEach((key) => {
        const value = student[key];
        if (value !== undefined && value !== "") {
          formData.append(key, String(value));
        }
      });

      if (image) {
        formData.append("image", image);
      }

      if (password) {
        console.log("🔹 Sending plain password:", password);
        formData.append("password", password);
      }

      const response = await fetch(`/api/registrar/student/edit/${studentID}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update student");

      alert("Student updated successfully!");
    } catch (err) {
      console.error("❌ Error updating student:", err);
      alert("Failed to update student");
    }
    setUpdating(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6 bg-white p-4 rounded shadow">
        <label className="block mb-2 text-gray-700 font-semibold">Enter Student ID:</label>
        <input
          type="number"
          value={studentID}
          onChange={(e) => setStudentID(e.target.value ? e.target.value : "")}
          className="border p-2 w-full rounded bg-white text-black"
        />
        <button
          onClick={handleFetchStudent}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mt-3 rounded shadow"
        >
          {loading ? "Fetching..." : "Fetch Student"}
        </button>
      </div>

      {student && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Student Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <input name="firstName" value={student.firstName} onChange={handleChange} className="border p-2 rounded bg-white text-black" placeholder="First Name" />
            <input name="middleName" value={student.middleName || ""} onChange={handleChange} className="border p-2 rounded bg-white text-black" placeholder="Middle Name" />
            <input name="lastName" value={student.lastName} onChange={handleChange} className="border p-2 rounded bg-white text-black" placeholder="Last Name" />
            <input name="age" type="number" value={student.age} onChange={handleChange} className="border p-2 rounded bg-white text-black" placeholder="Age" />
            <input name="phoneNumber" value={student.phoneNumber} onChange={handleChange} className="border p-2 rounded bg-white text-black" placeholder="Phone Number" />
            <input name="email" type="email" value={student.email} onChange={handleChange} className="border p-2 rounded bg-white text-black" placeholder="Email" />
            <input name="grade" type="number" value={student.grade} onChange={handleChange} className="border p-2 rounded bg-white text-black" placeholder="Grade" />
            <select
              name="gender"
              value={student.gender || ""}
              onChange={handleChange}
              className="border p-2 rounded bg-white text-black"
              required
            >
              <option value="" disabled>Select Gender</option>
              <option value="MALE">MALE</option>
              <option value="FEMALE">FEMALE</option>
            </select>
          </div>

          <div className="mt-4">
            <label className="block mb-2 text-gray-700 font-semibold">Profile Image:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="border p-2 w-full rounded bg-white text-black" />
            {image && (
              <Image src={URL.createObjectURL(image)} alt="Preview" width={96} height={96} className="mt-2 object-cover rounded" />
            )}
          </div>

          <div className="mt-4">
            <label className="block mb-2 text-gray-700 font-semibold">New Password (Optional):</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 w-full rounded bg-white text-black"
              placeholder="Enter new password"
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 mt-4 rounded shadow"
          >
            {updating ? "Updating..." : "Update Student"}
          </button>
        </form>
      )}
    </div>
  );
}
