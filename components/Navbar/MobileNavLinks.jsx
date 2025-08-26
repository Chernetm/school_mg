// import { DisclosureButton, DisclosurePanel } from "@headlessui/react";

// const links = [
//   { name: "Home", href: "/", current: true },
//   { name: "Announcement", href: "/announcement", current: false },
//   { name: "Contact", href: "/contact", current: false },
//   { name: "Login", href:"/login", current: false}
// ];

// const classNames = (...classes) => classes.filter(Boolean).join(" ");

// const MobileNavLinks = () => (
//   <DisclosurePanel className="sm:hidden">
//     <div className="space-y-1 px-2 pt-2 pb-3">
//       {links.map((item) => (
//         <DisclosureButton
//           key={item.name}
//           as="a"
//           href={item.href}
//           className={classNames(
//             item.current
//               ? "bg-blue-800 text-white"
//               : "text-white hover:bg-blue-700 hover:text-yellow-100",
//             "block rounded-md px-3 py-2 text-base font-medium"
//           )}
//           aria-current={item.current ? "page" : undefined}
//         >
//           {item.name}
//         </DisclosureButton>
//       ))}
//     </div>
//   </DisclosurePanel>
// );

// export default MobileNavLinks;
"use client";

import { DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { useSession, signOut } from "next-auth/react";

const baseLinks = [
  { name: "Home", href: "/", current: true },
  { name: "Announcement", href: "/announcement", current: false },
  { name: "Contact", href: "/contact", current: false },
];

const classNames = (...classes) => classes.filter(Boolean).join(" ");

const MobileNavLinks = () => {
  const { data: session } = useSession();

  // Add "Login" link if no session
  const links = session
    ? baseLinks
    : [...baseLinks, { name: "Login", href: "/login", current: false }];

  return (
    <DisclosurePanel className="sm:hidden">
      <div className="space-y-1 px-2 pt-2 pb-3">
        {links.map((item) => (
          <DisclosureButton
            key={item.name}
            as="a"
            href={item.href}
            className={classNames(
              item.current
                ? "bg-blue-800 text-white"
                : "text-white hover:bg-blue-700 hover:text-yellow-100",
              "block rounded-md px-3 py-2 text-base font-medium"
            )}
            aria-current={item.current ? "page" : undefined}
          >
            {item.name}
          </DisclosureButton>
        ))}

        {/* Logout button only if logged in */}
        {session && (
          <DisclosureButton
            as="button"
            onClick={() => signOut()}
            className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-white hover:bg-red-600 hover:text-white"
          >
            Logout
          </DisclosureButton>
        )}
      </div>
    </DisclosurePanel>
  );
};

export default MobileNavLinks;
