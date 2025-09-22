import { DisclosureButton } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const MobileMenuButton = () => (
  <DisclosureButton className="sm:hidden inline-flex items-center justify-center rounded-md p-1 text-white hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
    <span className="sr-only">Open main menu</span>
    <Bars3Icon className="block size-6 ui-not-open:block ui-open:hidden" />
    <XMarkIcon className="hidden size-6 ui-not-open:hidden ui-open:block" />
  </DisclosureButton>
);

export default MobileMenuButton;
