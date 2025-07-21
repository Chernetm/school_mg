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
"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const classNames = (...classes) => classes.filter(Boolean).join(" ");

const NavLinks = () => {
  const { data: session, status } = useSession(); // session includes user info

  const baseLinks = [
    { name: "Home", href: "/", current: false },
    { name: "Contact", href: "/contact", current: false },
  ];

  const role = session?.user?.role;
  const isLoggedIn = !!session;

  const dynamicLinks = [
    baseLinks[0], // Home

    // Show "Announcement" only if logged in
    ...(isLoggedIn
      ? [
          {
            name: "Announcement",
            href: `/${role}/announcement`,
            current: false,
          },
        ]
      : []),

    baseLinks[1], // Contact

    // Show "Login" if not logged in
    ...(!isLoggedIn
      ? [{ name: "Login", href: "/login", current: false }]
      : []),
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="hidden sm:ml-6 sm:block">
      <div className="flex space-x-4">
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

        {/* Show logout if logged in */}
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="text-white hover:bg-red-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium transition"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default NavLinks;
