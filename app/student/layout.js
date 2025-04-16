"use client";

import { StudentServicesDropdown } from "@/components/StudentServicesDropdown";

export default function StudentLayout({ children }) {
  

  return (
    <div className="relative">
  
      <div className="pt-20 pb-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dropdown */}
          <div className="w-full md:w-auto mx-auto md:mx-0 max-w-sm">
            <StudentServicesDropdown />
          </div>
  
          {/* Content */}
          <div className="md:col-span-2 space-y-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
