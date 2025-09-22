
// "use client";

// import { useUser } from "@/context/UserContext";
// import { Disclosure } from "@headlessui/react";
// import Logo from "./Logo";
// import MobileMenuButton from "./MobileMenuButton";
// import MobileNavLinks from "./MobileNavLinks";
// import ProfileMenu from "./ProfileMenu";
// import { useTranslation } from "@/app/providers";
// import { signOut } from "next-auth/react";
// import { useState } from "react";
// import Link from "next/link";
// import NavLinks from "./NavLinks";
// const classNames = (...classes) => classes.filter(Boolean).join(" ");

// export const Navbar = () => {
//   const { user } = useUser();
//   const role = user?.role || null;
//   const { t, locale, setLocale } = useTranslation();
//   const [showLoginOptions, setShowLoginOptions] = useState(false);

//   const handleLogout = async () => {
//       await signOut({ callbackUrl: "/" });
//     };
  

//   return (
//     <Disclosure as="nav" className="bg-blue-900 fixed w-full top-0 z-50 shadow-lg">
//       <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
//         <div className="relative flex h-16 items-center justify-between">
//           {/* Mobile menu toggle */}
//           <MobileMenuButton />

//           {/* Logo */}
//           <Logo />

//           {/* Desktop nav links */}
//           <div className="hidden sm:flex sm:space-x-4 sm:ml-6">
//             {/* You can also keep NavLinks component here if needed */}
//           </div>
          

//           <div className="flex items-center space-x-4">
//             {/* Profile menu if logged in */}
//             <NavLinks role={role} />
            

//             {/* Login button (always visible if not logged in) */}
//             {!user && (
//               <div className="relative">
//                 <button
//                 onClick={() => setShowLoginOptions(!showLoginOptions)}
//                 className={classNames(
//                   "text-white hover:bg-blue-800 hover:text-yellow-100",
//                   "rounded-md px-3 py-2 text-sm font-medium transition"
//                 )}
//               >
//                 {t("login")}
//               </button>

//                 {showLoginOptions && (
//                   <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md py-2 w-40 z-50">
//                     <Link
//                       href="/login/admin"
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     >
    
//                       {t("admin")}
//                     </Link>
//                     <Link
//                       href="/login"
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     >
//                       {t("student")}
//                     </Link>
//                     <Link
//                       href="/login/teacher"
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     >
//                       {t("teacher")}
//                     </Link>
//                   </div>
//                 )}
//               </div>
//             )}
//             {user&&(<button
//             onClick={handleLogout}
//             className="text-white hover:bg-red-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium transition"
//           >
//             {t("logout")}
//           </button>)

//             }
//             {user && <ProfileMenu user={user} />}

//             {/* Language switcher */}
//             <button
//               onClick={() => setLocale(locale === "en" ? "am" : "en")}
//               className="bg-gray-700 text-white rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-600 transition"
//             >
//               {locale === "en" ? "አማ" : "EN"}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile collapsible menu */}
//       <MobileNavLinks />
//     </Disclosure>
//   );
// };

// export default Navbar;






"use client";

import { Disclosure } from "@headlessui/react";
import Logo from "./Logo";
import MobileMenuButton from "./MobileMenuButton";
import MobileNavLinks from "./MobileNavLinks";
import { useTranslation } from "@/app/providers";
import { signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import NavLinks from "./NavLinks";
import ProfileMenu from "./ProfileMenu";
import { useUser } from "@/context/UserContext";
const classNames = (...classes) => classes.filter(Boolean).join(" ");

export const Navbar = () => {
  const { user } = useUser();
  const role = user?.role || null;
  const { t, locale, setLocale } = useTranslation();
  const [showLoginOptions, setShowLoginOptions] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };


  return (
    <Disclosure as="nav" className="bg-blue-900 fixed w-full top-0 z-50 shadow-lg">
      <div className="flex justify-between items-center h-16 px-2 sm:px-6 lg:px-8">

        {/* Left side: Mobile button + Logo */}
        <div className="flex items-center gap-1 pl-0">
          <MobileMenuButton />
          <Logo />
        </div>

        {/* Right side: Nav + Buttons */}
        <div className="flex items-center space-x-4">
          <NavLinks role={role}/>

          {!user && (
            <div className="relative">
              <button
                onClick={() => setShowLoginOptions(!showLoginOptions)}
                className={classNames(
                  "text-white hover:bg-blue-800 hover:text-yellow-100",
                  "rounded-md px-3 py-2 text-sm font-medium transition"
                )}
              >
                {t("login")}
              </button>
              {showLoginOptions && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md py-2 w-40 z-50">
                  <Link
                    href="/login/admin"
                    onClick={() => setShowLoginOptions(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {t("admin")}
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setShowLoginOptions(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {t("student")}
                  </Link>
                  <Link
                    href="/login/teacher"
                    onClick={() => setShowLoginOptions(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {t("teacher")}
                  </Link>
                </div>
              )}

            </div>
          )}

          
          {user && (
            <button
              onClick={handleLogout}
              className="text-white hover:bg-red-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium transition"
            >
              {t("logout")}
            </button>
          )}
           {user && <ProfileMenu user={user} />}

          <button
            onClick={() => setLocale(locale === "en" ? "am" : "en")}
            className="bg-gray-700 text-white rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-600 transition"
          >
            {locale === "en" ? "አማ" : "EN"}
          </button>
        </div>
      </div>

      {/* Mobile collapsible menu */}
      <MobileNavLinks />
    </Disclosure>


  );
};

export default Navbar;
