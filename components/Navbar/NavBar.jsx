
// "use client";


// import { Disclosure } from "@headlessui/react";
// import Logo from "./Logo";
// import MobileMenuButton from "./MobileMenuButton";
// import MobileNavLinks from "./MobileNavLinks";
// import NavLinks from "./NavLinks";
// import ProfileMenu from "./ProfileMenu";

// export const Navbar = () => {
//   const { user } = useUser();
//   const role = user?.role || null; // Get the role from the user object or set it to null if not available
  
//   return (
//     <Disclosure as="nav" className="bg-blue-900 fixed w-full top-0 z-50 shadow-lg">
//       <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
//         <div className="relative flex h-16 items-center justify-between">
//           <MobileMenuButton />
//           <Logo />
//           <NavLinks role={role} />
//           {user && <ProfileMenu user={user} />}
//         </div>
//       </div>
//       <MobileNavLinks />
//     </Disclosure>
//   );
// };

// export default Navbar;
"use client";

import { Disclosure } from "@headlessui/react";
import { useSession } from "next-auth/react"; // ✅ Import useSession from next-auth
import Logo from "./Logo";
import MobileMenuButton from "./MobileMenuButton";
import MobileNavLinks from "./MobileNavLinks";
import NavLinks from "./NavLinks";
import ProfileMenu from "./ProfileMenu";

export const Navbar = () => {
  const { data: session, status } = useSession(); // ✅ Get session data and status
  const user = session?.user || null;
  const role = user?.role || null;

  return (
    <Disclosure as="nav" className="bg-blue-900 fixed w-full top-0 z-50 shadow-lg">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <MobileMenuButton />
          <Logo />
          <NavLinks role={role} />
          {user && <ProfileMenu user={user} loading={status === "loading"} />}
        </div>
      </div>
      <MobileNavLinks />
    </Disclosure>
  );
};

export default Navbar;
