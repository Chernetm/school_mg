
"use client";

import { DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { useSession, signOut } from "next-auth/react";
import { useTranslation } from "@/app/providers";
import Link from "next/link";

const classNames = (...classes) => classes.filter(Boolean).join(" ");

const MobileNavLinks = () => {
  const { data: session } = useSession();
  const { t } = useTranslation();

  const baseLinks = [
    { name: t("home"), href: "/", current: true },
    { name: t("announcement"), href: "/announcement", current: false },
    { name: t("clubs"), href: "/#club", current: false },
    { name: t("pay_fee"), href: "/fee", current: false },
    { name: t("contact"), href: "/#contact", current: false },
  ];

  // Add "Login" link if no session
  const links = session
    ? baseLinks
    : [...baseLinks];

  return (
    <DisclosurePanel className="sm:hidden">
      <div className="space-y-1 px-2 pt-2 pb-3">
        {links.map((item) => (
          <DisclosureButton
            key={item.name}
            as={Link}
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

      </div>
    </DisclosurePanel>
  );
};

export default MobileNavLinks;
