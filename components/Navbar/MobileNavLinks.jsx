import { DisclosureButton, DisclosurePanel } from "@headlessui/react";

const links = [
  { name: "Home", href: "/", current: true },
  { name: "About", href: "/about", current: false },
  { name: "Contact", href: "/contact", current: false },
];

const classNames = (...classes) => classes.filter(Boolean).join(" ");

const MobileNavLinks = () => (
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
    </div>
  </DisclosurePanel>
);

export default MobileNavLinks;
