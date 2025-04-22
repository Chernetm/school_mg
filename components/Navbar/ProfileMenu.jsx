
"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const ProfileMenu = ({ loading, user }) => {
  const role = user?.role || "student"; // fallback if role is undefined
  const announRole= user?.role || "announcement"
  const annuHref=`/${announRole}/announcement/staff`

  const menuItems = [
    { label: "Settings", href: `/${role}/setting` },
    { label: "Sign out", isLogout: true },
  ];

  return (
    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
      {/* Only show these if role is one of the specific ones */}
      {["admin", "head","registrar", "teacher", "library"].includes(role) && (
        <>
          <Link href={annuHref}>
            <button
              type="button"
              className="relative rounded-full bg-blue-900 p-1 text-white hover:text-yellow-300 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="size-6" />
            </button>
          </Link>

          <Menu as="div" className="relative ml-3">
            <div>
              <MenuButton className="relative flex rounded-full bg-blue-900 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900">
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={
                    user.image ||
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                  }
                  alt="User avatar"
                />
              </MenuButton>
            </div>

            <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-4 py-2 text-sm text-gray-700 font-semibold border-b">
                Role: {loading ? "Loading..." : user.role}
              </div>

              {menuItems.map(({ label, href, isLogout }) => (
                <MenuItem key={label}>
                  {({ active }) =>
                    isLogout ? (
                      <button
                        onClick={async () => {
                          try {
                            const res = await fetch("/api/logout", {
                              method: "POST",
                            });
                            if (res.ok) {
                              window.location.href = "/";
                            } else {
                              console.error("Logout failed");
                            }
                          } catch (err) {
                            console.error("Logout error:", err);
                          }
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        }`}
                      >
                        {label}
                      </button>
                    ) : (
                      <Link
                        href={href}
                        className={`block px-4 py-2 text-sm ${
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        }`}
                      >
                        {label}
                      </Link>
                    )
                  }
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        </>
      )}
    </div>
  );
};

export default ProfileMenu;
