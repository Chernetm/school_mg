"use client";
import { BarChart, Bell, Book, Calendar, ChevronDown, ChevronUp, DollarSign, Home, LayoutGridIcon, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const Navbar = () => {
  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col p-4 shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Admin Panel</h2>
      <nav className="flex-1">
        <ul className="space-y-2">
          <NavItem href="/" icon={<Home />} label="Dashboard" />
          
          <DropdownNav label="Academic" icon={<LayoutGridIcon />} items={[
            { href: "/year", label: "Year View/Edit" },
            { href: "/semester", label: "Semester View/Edit" },
            { href: "/grade_section", label: "Register Grade & Section" },
            { href: "/grade_section/edit", label: "Edit Grade & Section" },
          ]}/>
          <DropdownNav label="Students" icon={<Users />} items={[
            { href: "/student/edit", label: "View/Edit Details" },
            { href: "/student/register", label: "Register Student" },
            
            { href: "/students/communication", label: "Parent Communication" }
          ]} />


          <DropdownNav label="Staff" icon={<Users />} items={[
            { href: "/staff/register", label: "Register Staff" },
            { href: "/staff/assign", label: "Manage Staff" },
            { href: "/staff", label: "Teacher Assigned Section" },
            { href: "/staff/teacher_section", label: "Class Assignments" },
            
          ]} />

          <DropdownNav label="Attendance" icon={<Calendar />} items={[
            { href: "/attendance/", label: "Student Attendance Reports" },
            { href: "/attendance/staff", label: "Taking Staff Attendance" },
            { href: "/attendance/staff/record", label: "Staff Attendance Reports" }
          ]} />

          <DropdownNav label="Exams" icon={<Book />} items={[
            { href: "/exams/schedule", label: "Schedule Exams" },
            { href: "/exams/invigilators", label: "Assign Invigilators" },
            { href: "/exams/results", label: "Manage Results" },
            { href: "/exams/reports", label: "Generate Report Cards" }
          ]} />

          <DropdownNav label="Fees" icon={<DollarSign />} items={[
            { href: "/fees/payments", label: "Track Payments" },
            { href: "/fees/invoices", label: "Generate Invoices" },
            { href: "/fees/reminders", label: "Send Reminders" }
          ]} />
          <DropdownNav label="Parent" icon={<Users />} items={[
            { href: "/parent", label: "List & Register Parent" },
            { href: "/parent/edit", label: "Parent Edit" },
          ]} />


          <DropdownNav label="Reports" icon={<BarChart />} items={[
            { href: "/reports/attendance", label: "Attendance Reports" },
            { href: "/reports/academic", label: "Academic Reports" },
            { href: "/reports/finance", label: "Financial Reports" }
          ]} />

          <NavItem href="/notifications" icon={<Bell />} label="Notifications" />
        </ul>
      </nav>
    </div>
  );
};

// Standard Nav Item (Without Dropdown)
const NavItem = ({ href, icon, label }) => (
  <li className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200">
    {icon}
    <Link href={href} className="text-lg">{label}</Link>
  </li>
);

// Dropdown Menu for Sections with Sub-Links
const DropdownNav = ({ label, icon, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200"
      >
        <span className="flex items-center space-x-3">
          {icon}
          <span className="text-lg">{label}</span>
        </span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isOpen && (
        <ul className="ml-8 mt-1 space-y-1">
          {items.map((item, index) => (
            <li key={index}>
              <Link href={item.href} className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};
