"use client";
import ParentForm from "@/components/ParentForm";
import useParentForm from "@/hooks/useParentForm";
import { useEffect, useState } from "react";

export default function ParentsPage() {
  const [parents, setParents] = useState([]);
  const {
    formData,
    handleChange,
    resetForm,
    message,
    setMessage
  } = useParentForm();

  useEffect(() => {
    fetchParents();
  }, []);

  const fetchParents = async () => {
    try {
      const res = await fetch("/api/registrar/parent");
      const data = await res.json();
      setParents(data);
    } catch (error) {
      console.error("Failed to fetch parents:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/registrar/parent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      setMessage(result.success || result.error);

      if (result.success) {
        resetForm();
        fetchParents();
      }
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Parent Management</h2>
      <ParentForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Add Parent"
        message={message}
      />
      <div className="bg-white mt-6 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-3 text-gray-800">Registered Parents</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-100 text-gray-800">
              <th className="border p-3">Parent ID</th>
              <th className="border p-3">First Name</th>
              <th className="border p-3">Last Name</th>
              <th className="border p-3">Email</th>
              <th className="border p-3">Phone</th>
            </tr>
          </thead>
          <tbody>
            {parents.map((parent) => (
              <tr key={parent.id} className="text-center hover:bg-gray-50">
                <td className="border p-3">{parent.id}</td>
                <td className="border p-3">{parent.firstName}</td>
                <td className="border p-3">{parent.lastName}</td>
                <td className="border p-3">{parent.email}</td>
                <td className="border p-3">{parent.phoneNumber || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



// "use client";

// import { useEffect, useState } from "react";

// export default function ParentsPage() {
//   const [parents, setParents] = useState([]);
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     phoneNumber: "",
//     address: "",
//   });
//   const [message, setMessage] = useState("");

//   // Fetch all parents from API
//   useEffect(() => {
//     async function fetchParents() {
//       try {
//         const res = await fetch("/api/registrar/parent");
//         if (!res.ok) throw new Error("Failed to fetch parents");
//         const data = await res.json();
//         setParents(data);
//       } catch (error) {
//         console.error(error);
//       }
//     }
//     fetchParents();
//   }, []);

//   // Handle form input changes
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch("/api/registrar/parent", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const result = await res.json();
//       setMessage(result.success || result.error);

//       if (result.success) {
//         setFormData({ firstName: "", lastName: "", email: "", password: "", phoneNumber: "", address: "" });
//         const updatedRes = await fetch("/api/registrar/parent");
//         const updatedParents = await updatedRes.json();
//         setParents(updatedParents);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto bg-gray-100 min-h-screen">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Parent Management</h2>

//       {/* Registration Form */}
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
//         {message && <p className="text-sm text-red-600 mb-2">{message}</p>}
//         <div className="grid grid-cols-2 gap-4">
//           <input className="p-3 border border-gray-300 bg-gray-50 text-black rounded-md" type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
//           <input className="p-3 border border-gray-300 bg-gray-50 text-black  rounded-md" type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
//           <input className="p-3 border border-gray-300 bg-gray-50 text-black rounded-md" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
//           <input className="p-3 border border-gray-300 bg-gray-50 text-black rounded-md" type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
//           <input className="p-3 border border-gray-300 bg-gray-50 text-black  rounded-md" type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} />
//           <input className="p-3 border border-gray-300 bg-gray-50 text-black rounded-md" type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
//         </div>
//         <button type="submit" className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition">Add Parent</button>
//       </form>

//       {/* Parent List */}
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h3 className="text-lg font-bold mb-3 text-gray-800">Registered Parents</h3>
//         <table className="w-full border-collapse border border-gray-300">
//           <thead>
//             <tr className="bg-blue-100 text-gray-800">
//               <th className="border p-3">Parent ID</th>
//               <th className="border p-3">First Name</th>
//               <th className="border p-3">Last Name</th>
//               <th className="border p-3">Email</th>
//               <th className="border p-3">Phone</th>
//             </tr>
//           </thead>
//           <tbody>
//             {parents.map((parent) => (
//               <tr key={parent.id} className="text-center hover:bg-gray-50">
//                 <td className="border p-3 text-black ">{parent.id}</td>
//                 <td className="border p-3 text-black ">{parent.firstName}</td>
//                 <td className="border p-3 text-black ">{parent.lastName}</td>
//                 <td className="border p-3 text-black " >{parent.email}</td>
//                 <td className="border p-3 text-black ">{parent.phoneNumber || "N/A"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


