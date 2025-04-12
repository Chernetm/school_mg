"use client";
import { BarChart, Bell, Book, Calendar, ChevronDown, ChevronUp, DollarSign, Home, LayoutGridIcon, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const Dashboard = () => {
  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col p-4 shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Admin Panel</h2>
      <nav className="flex-1">
        <ul className="space-y-2">
          <NavItem href="/" icon={<Home />} label="Dashboard" />
          
          <DropdownNav label="Academic" icon={<LayoutGridIcon />} items={[
            { href: "/admin/year", label: "Year View/Edit" },
            { href: "/admin/semester", label: "Semester View/Edit" },
            { href: "/admin/subject", label: "Subject View/Edit" },
            { href: "/admin/grade_section", label: "Register Grade & Section" },
            { href: "/admin/grade_section/edit", label: "Edit Grade & Section" },
          ]}/>
          <DropdownNav label="Students" icon={<Users />} items={[
            { href: "/student/edit", label: "View/Edit Details" },
            { href: "/student/register", label: "Register Student" },
            
            { href: "/students/communication", label: "Parent Communication" }
          ]} />


          <DropdownNav label="Admin" icon={<Users />} items={[
            { href: "/admin/register", label: "Register Staff" },
            { href: "/admin/teacher", label: "Manage Teacher" },
            { href: "/admin/teacher/assign", label: "Teacher Assign" },
            { href: "/admin/teacher", label: "Class Assignments" },
            
          ]} />

          <DropdownNav label="Attendance" icon={<Calendar />} items={[
           
            { href: "/admin/attendance", label: "Taking Staff Attendance" },
            { href: "/admin/attendance/student", label: "Student Attendance Reports" }
          ]} />

          <DropdownNav label="Exams" icon={<Book />} items={[
            { href: "/admin/exam/control", label: "Control Exams" },
            { href: "/admin/exam/create", label: "Create Exam" },
            { href: "/admin/exam/result", label: "Exam Result" },
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
