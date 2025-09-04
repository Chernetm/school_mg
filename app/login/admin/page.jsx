
"use client";
import { useEffect, useState } from "react";
import { MdDesktopMac, MdPhoneIphone } from "react-icons/md";

import { getSession } from "next-auth/react";

import { sanitizeInput, validateForm } from "@/utils/formUtils";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaKey, FaUser } from "react-icons/fa";
import Spinner from "@/components/Loading/Spinner/page";
import Footer from "@/components/Footer";
import { useTranslation } from "@/app/providers";

export default function AdminLoginPage() {
    const [id, setId] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const{t}=useTranslation()

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setLoading(false); // <-- Only finish loading after first check
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  const handleLogin = async (e) => {

    e.preventDefault();
    setLoading(true);
    setError("");
    const idField = "staffID";

    const formData = {
      [idField]: sanitizeInput(id),
      email: sanitizeInput(email),
      password: sanitizeInput(password),
    };

    const validationError = validateForm(formData);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    const res = await signIn("admin-login", {
      redirect: false,
      ...formData,
    });


    if (res.ok) {

      const session = await getSession();
      const role = session?.user.role;

      switch (role) {
        case "admin":
          router.push("/admin/announcement");
          break;
        case "head":
          router.push("/head/announcement");
          break;
        case "registrar":
          router.push("/registrar/announcement");
          break;
        default:
          router.push("/announcement");
      }

    } else {
      if (res.error === "429") {
       setError(t("error_too_many_attempts"));
      } else {
        setError(t("error_invalid_credentials"));
      }
      setLoading(false);
    }
  };


  // While loading, render nothing
  if (loading) return <Spinner />;

  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4 bg-gray-100">
        <MdPhoneIphone className="text-red-500 text-6xl mb-4 animate-bounce" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t("access_denied")}</h1>
        <p className="text-lg text-gray-600 mb-4">
          {/* Staff login is <span className="text-red-600 font-semibold">not available</span> on mobile devices. */}
          {t("staff_login_not_available")}
        </p>
        <div className="flex items-center gap-2 text-gray-500">
          <MdDesktopMac className="text-2xl" />
          <span className="text-md">{t("please_switch")}</span>
        </div>
      </div>
    );
  }


  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-800">
          {t("admin_login")}
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="flex items-center border border-gray-300 rounded-lg">
          <FaUser className="text-gray-500 p-2" />
          <input
            type="text"
            value={id}
            onChange={(e) => setId(sanitizeInput(e.target.value))}
            className="w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black rounded-r-lg"
            placeholder={t("enter_admin_id")}
            required
          />
        </div>


        <div className="flex items-center border border-gray-300 rounded-lg">
          <FaEnvelope className="text-gray-500 p-2" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(sanitizeInput(e.target.value))}
            className="w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black rounded-r-lg"
            placeholder={t("enter_email")}
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
    <Footer/>
    </div>
  );
}






// "use client";

// import LoginForm from "@/components/LoginForm";
// import { useEffect, useState } from "react";
// import { MdDesktopMac, MdPhoneIphone } from "react-icons/md";

// export default function AdminLoginPage() {
//   const [isMobile, setIsMobile] = useState(false);
//   const [loading, setLoading] = useState(true); // <-- Add loading state

//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       setLoading(false); // <-- Only finish loading after first check
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // While loading, render nothing
//   if (loading) return null;

//   if (isMobile) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen text-center px-4 bg-gray-100">
//         <MdPhoneIphone className="text-red-500 text-6xl mb-4 animate-bounce" />
//         <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
//         <p className="text-lg text-gray-600 mb-4">
//           Staff login is <span className="text-red-600 font-semibold">not available</span> on mobile devices.
//         </p>
//         <div className="flex items-center gap-2 text-gray-500">
//           <MdDesktopMac className="text-2xl" />
//           <span className="text-md">Please switch to a desktop or tablet</span>
//         </div>
//       </div>
//     );
//   }

//   return <LoginForm type="admin" />;
//}
