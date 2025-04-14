"use client";

import { Disclosure } from "@headlessui/react";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import MobileMenuButton from "./MobileMenuButton";
import MobileNavLinks from "./MobileNavLinks";
import NavLinks from "./NavLinks";
import ProfileMenu from "./ProfileMenu";

export const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth", { credentials: "include" });
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user); // ✅ only if authenticated
        } else {
          setUser(null); // ❌ unauthenticated
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, []);
  
  return (
    <Disclosure as="nav" className="bg-blue-900 fixed w-full top-0 z-50 shadow-lg">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <MobileMenuButton />
          <Logo />
          <NavLinks />
          {user && ( <ProfileMenu loading={loading} user={user}/> )}  
         
        </div>
      </div>
      <MobileNavLinks />
    </Disclosure>
  );
};

export default Navbar;
