
"use client";

import { useUser } from "@/context/UserContext";
import { Disclosure } from "@headlessui/react";
import Logo from "./Logo";
import MobileMenuButton from "./MobileMenuButton";
import MobileNavLinks from "./MobileNavLinks";
import NavLinks from "./NavLinks";
import ProfileMenu from "./ProfileMenu";

export const Navbar = () => {
  const { user } = useUser();
  const role = user?.role || null; // Get the role from the user object or set it to null if not available
  
  return (
    <Disclosure as="nav" className="bg-blue-900 fixed w-full top-0 z-50 shadow-lg">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <MobileMenuButton />
          <Logo />
          <NavLinks role={role} />
          {user && <ProfileMenu user={user} />}
        </div>
      </div>
      <MobileNavLinks />
    </Disclosure>
  );
};

export default Navbar;
