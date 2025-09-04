"use client";

import { sanitizeInput, validateForm } from "@/utils/formUtils";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaKey, FaUser } from "react-icons/fa";
import Spinner from "@/components/Loading/Spinner/page";
import Footer from "@/components/Footer";
import { useTranslation } from "@/app/providers"; // ✅ translation hook

export default function LoginForm() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation(); // ✅ use translation

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const idField = "studentID";

    const formData = {
      [idField]: sanitizeInput(id),
      password: sanitizeInput(password),
    };

    const validationError = validateForm(formData);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    const res = await signIn("student-login", {
      redirect: false,
      ...formData,
    });

    if (res?.ok) {
      router.push("/student");
    } else {
      if (res?.error === "429") {
        setError(t("error_too_many_attempts"));
      } else {
        setError(t("error_invalid_credentials"));
      }
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6"
        >
          <h2 className="text-2xl font-bold text-center text-indigo-800">
            {t("student_login")}
          </h2>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <div className="flex items-center border border-gray-300 rounded-lg">
            <FaUser className="text-gray-500 p-2" />
            <input
              type="text"
              value={id}
              onChange={(e) => setId(sanitizeInput(e.target.value))}
              className="w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black rounded-r-lg"
              placeholder={t("enter_student_id")}
              required
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-lg">
            <FaKey className="text-gray-500 p-2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(sanitizeInput(e.target.value))}
              className="w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black rounded-r-lg"
              placeholder={t("enter_password")}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-700"
          >
            {t("login")}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}



// "use client";

// import { sanitizeInput, validateForm } from "@/utils/formUtils";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { FaEnvelope, FaKey, FaUser } from "react-icons/fa";
// import Spinner from "@/components/Loading/Spinner/page";
// import Footer from "@/components/Footer";

// export default function LoginForm() {
//   const [id, setId] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
  
// const handleLogin = async (e) => {
  
//   e.preventDefault();
//   setLoading(true);
//   setError("");

//   const idField = "studentID";

//   const formData = {
//     [idField]: sanitizeInput(id),
//     password: sanitizeInput(password),
//   };

//   const validationError = validateForm(formData);
//   if (validationError) {
//     setError(validationError);
//     setLoading(false);
//     return;
//   }

//   const res = await signIn("student-login", {
//     redirect: false,
//     ...formData,
//   });

  
//   if (res.ok) {
//     router.push("/student");
    
//   }
//    else {
//     if (res.error === "429") {
//       setError("Too many login attempts. Please wait 10 minutes.");
//     } else {
//       setError("Login failed. Please check your credentials.");
//     }
//     setLoading(false);
//   }
// };

// if(loading) return <Spinner/>

//   return (
//     <div>
      
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <form
//         onSubmit={handleLogin}
//         className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6"
//       >
//         <h2 className="text-2xl font-bold text-center text-indigo-800">
//          Student Login
//         </h2>

//         {error && <p className="text-red-500 text-sm text-center">{error}</p>}

//         <div className="flex items-center border border-gray-300 rounded-lg">
//           <FaUser className="text-gray-500 p-2" />
//           <input
//             type="text"
//             value={id}
//             onChange={(e) => setId(sanitizeInput(e.target.value))}
//             className="w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black rounded-r-lg"
//             placeholder={`Enter your Student ID`}
//             required
//           />
//         </div>
//         <div className="flex items-center border border-gray-300 rounded-lg">
//           <FaKey className="text-gray-500 p-2" />
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(sanitizeInput(e.target.value))}
//             className="w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black rounded-r-lg"
//             placeholder="Enter your password"
//             required
//           />
//         </div>

//         <button
//             type="submit"
//             className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-700"
//           >
//             Login
//           </button>
//       </form>
      
//     </div>
//     <Footer/>

//     </div>
  
//   );
// }