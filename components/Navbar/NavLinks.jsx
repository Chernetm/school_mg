"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useTranslation } from "@/app/providers"; // ✅ import translation hook

const classNames = (...classes) => classes.filter(Boolean).join(" ");

const NavLinks = ({ role }) => {
  const { t, locale, setLocale } = useTranslation(); // ✅ use translations

  const baseLinks = [
    { name: t("home"), href: "/", current: false },
    { name: t("contact"), href: "/contact", current: false },
  ];

  const isLoggedIn = role;
  const announcementHref = role ? `/${role}/announcement` : "/announcement";

  const dynamicLinks = [
    baseLinks[0],
    { name: t("announcement"), href: announcementHref, current: false },
    baseLinks[1],
    ...(!isLoggedIn ? [{ name: t("login"), href: "/login", current: false }] : []),
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="hidden sm:ml-6 sm:block">
      <div className="flex space-x-4 items-center">
        {dynamicLinks.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={classNames(
              item.current
                ? "bg-blue-700 text-white"
                : "text-white hover:bg-blue-800 hover:text-yellow-100",
              "rounded-md px-3 py-2 text-sm font-medium transition"
            )}
            aria-current={item.current ? "page" : undefined}
          >
            {item.name}
          </Link>
        ))}

        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="text-white hover:bg-red-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium transition"
          >
            {t("logout")}
          </button>
        )}

        {/* ✅ Language Switcher (English ⇄ Amharic) */}
        <button
          onClick={() => setLocale(locale === "en" ? "am" : "en")}
          className="ml-4 bg-gray-700 text-white rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-600 transition"
        >
          {locale === "en" ? "አማ" : "EN"}
        </button>
      </div>
    </div>
  );
};

export default NavLinks;



// import Link from "next/link";

// import { signOut, useSession } from "next-auth/react";


// const classNames = (...classes) => classes.filter(Boolean).join(" ");

// const NavLinks = () => {
//   const { data: session } = useSession(); // Get the session data

  

//   const baseLinks = [
//     { name: "Home", href: "/", current: false },
//     { name: "Contact", href: "/contact", current: false },
//   ];
//   const role = session?.user.role
//   const announcementHref = role ? `/${role}/announcement` : "/announcement";

//   const links = [
//     baseLinks[0],
//     { name: "Announcement", href: announcementHref, current: false },
//     ...baseLinks.slice(1),
//   ];
 
//   const handleLogout = async () => {
//     await signOut({ callbackUrl: "/" }); // Redirect to homepage after logout
//   };
//   return (
//     <div className="hidden sm:ml-6 sm:block">
//       <div className="flex space-x-4">
//         {links.map((item) => (
//           <Link
//             key={item.name}
//             href={item.href}
//             className={classNames(
//               item.current
//                 ? "bg-blue-700 text-white"
//                 : "text-white hover:bg-blue-800 hover:text-yellow-100",
//               "rounded-md px-3 py-2 text-sm font-medium transition"
//             )}
//             aria-current={item.current ? "page" : undefined}
//           >
//             {item.name}
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default NavLinks;




// "use client";

// import Link from "next/link";
// import { signOut, useSession } from "next-auth/react";

// const classNames = (...classes) => classes.filter(Boolean).join(" ");

// const NavLinks = ({role}) => {
  
//   const baseLinks = [
//     { name: "Home", href: "/", current: false },
//     { name: "Contact", href: "/contact", current: false },
//   ];

//   const isLoggedIn =role;

//   const announcementHref = role ? `/${role}/announcement` : "/announcement";


//   const dynamicLinks = [
//     baseLinks[0], // Home
//     { name: "Announcement", href: announcementHref, current: false },

//     baseLinks[1], // Contact

//     // Show "Login" if not logged in
//     ...(!isLoggedIn
//       ? [{ name: "Login", href: "/login", current: false }]
//       : []),
//   ];

//   const handleLogout = async () => {
//     await signOut({ callbackUrl: "/" });
//   };

//   return (
//     <div className="hidden sm:ml-6 sm:block">
//       <div className="flex space-x-4">
//         {dynamicLinks.map((item) => (
//           <Link
//             key={item.name}
//             href={item.href}
//             className={classNames(
//               item.current
//                 ? "bg-blue-700 text-white"
//                 : "text-white hover:bg-blue-800 hover:text-yellow-100",
//               "rounded-md px-3 py-2 text-sm font-medium transition"
//             )}
//             aria-current={item.current ? "page" : undefined}
//           >
//             {item.name}
//           </Link>
//         ))}

//         {/* Show logout if logged in */}
//         {isLoggedIn && (
//           <button
//             onClick={handleLogout}
//             className="text-white hover:bg-red-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium transition"
//           >
//             Logout
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NavLinks;
