import Link from "next/link";

const classNames = (...classes) => classes.filter(Boolean).join(" ");

const NavLinks = ({role}) => {
  

  const baseLinks = [
    { name: "Home", href: "/", current: true },
    { name: "About", href: "/about", current: false },
    { name: "Contact", href: "/contact", current: false },
  ];

  const announcementHref = role ? `/${role}/announcement` : "/announcement";

  const links = [
    baseLinks[0],
    { name: "Announcement", href: announcementHref, current: false },
    ...baseLinks.slice(1),
  ];

  return (
    <div className="hidden sm:ml-6 sm:block">
      <div className="flex space-x-4">
        {links.map((item) => (
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
      </div>
    </div>
  );
};

export default NavLinks;



// import Link from "next/link";
// const role="head"

// const links = [
//   { name: "Home", href: "#", current: true },
//   { name: "Announcement", href: `/${role}/announcement`, current: false },
//   { name: "About", href: "#", current: false },
//   { name: "Contact", href: "#", current: false },
// ];

// const classNames = (...classes) => classes.filter(Boolean).join(" ");

// const NavLinks = () => (
//   <div className="hidden sm:ml-6 sm:block">
//     <div className="flex space-x-4">
//       {links.map((item) => (
//         <Link
//           key={item.name}
//           href={item.href}
//           className={classNames(
//             item.current
//               ? "bg-blue-700 text-white"
//               : "text-white hover:bg-blue-800 hover:text-yellow-100",
//             "rounded-md px-3 py-2 text-sm font-medium transition"
//           )}
//           aria-current={item.current ? "page" : undefined}
//         >
//           {item.name}
//         </Link>
//       ))}
//     </div>
//   </div>
// );

// export default NavLinks;
