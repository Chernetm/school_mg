
// "use client";
// import LoginForm from "@/components/LoginForm";
// import { useRouter } from "next/navigation";
// import {
//   MdBadge,
//   MdLock,
//   MdLogin
// } from "react-icons/md";

// export default function StaffLogin() {
//   const router = useRouter();
 

//   const handleStudentLogin = async (credentials, setError, setLoading) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await fetch("/api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(credentials),
//       });

//       if (!res.ok) {
//         const data = await res.json();
//         throw new Error(data.message);
//       }

//       router.push("/student/profile");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
 

//   return (
//     <>
//       {loading && <LoadingSpinner />}

//       <LoginForm
//         title="Student Login"
//         icon={<MdLogin className="text-5xl text-blue-500 mx-auto mb-4" />}
//         fields={[
//           {
//             name: "studentID",
//             type: "text",
//             placeholder: "Student ID",
//             icon: <MdBadge className="text-gray-400" />,
//           },
//           {
//             name: "password",
//             type: "password",
//             placeholder: "Password",
//             icon: <MdLock className="text-gray-400" />,
//           },
//         ]}
//         onSubmit={(credentials, setError) => handleStudentLogin(credentials, setError)}
//       />
//     </>
//   );


// }



"use client";
import Spinner from "@/components/Loading/Spinner/page";
import LoginForm from "@/components/LoginForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdBadge, MdLock, MdLogin } from "react-icons/md";

export default function StaffLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStudentLogin = async (credentials, setError) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      router.push("/student/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Spinner />}

      <LoginForm
        title="Student Login"
        icon={<MdLogin className="text-5xl text-blue-500 mx-auto mb-4" />}
        fields={[
          {
            name: "studentID",
            type: "text",
            placeholder: "Student ID",
            icon: <MdBadge className="text-gray-400" />,
          },
          {
            name: "password",
            type: "password",
            placeholder: "Password",
            icon: <MdLock className="text-gray-400" />,
          },
        ]}
        onSubmit={(credentials, setError) => handleStudentLogin(credentials, setError)}
      />
    </>
  );
}
