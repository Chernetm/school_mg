"use client";

import Link from "next/link";
import { useTranslation } from "@/app/providers";


const classNames = (...classes) => classes.filter(Boolean).join(" ");

const NavLinks = ({ role }) => {
  const { t } = useTranslation();

  const baseLinks = [
    { name: t("home"), href: "/", current: false },
    { name: t("contact"), href: "/#contact", current: false },
    { name: t("clubs"), href: "/#club", current: false },
    { name: t("pay_fee"), href: "/fee", current: false },
  ];

  const isLoggedIn = role;
  const announcementHref = role ? `/${role}/announcement` : "/announcement";

  const dynamicLinks = [
    baseLinks[0],
    { name: t("announcement"), href: announcementHref, current: false },
    ...baseLinks.slice(1),
  ];


  return (
    <div className="hidden sm:ml-6 sm:block">
      <div className="flex space-x-4 items-center relative">
        {dynamicLinks.map((item) =>
          
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
          
        )}
      </div>
    </div>
  );
};

export default NavLinks;
