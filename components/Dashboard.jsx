// "use client";
// import { BarChart, Bell, Book, Calendar, ChevronDown, ChevronUp, DollarSign, Home, LayoutGridIcon, Users } from "lucide-react";
// import Link from "next/link";
// import { useState } from "react";

// export const Dashboard = () => {
//   return (
//     <div className="h-screen w-64 bg-gray-900 text-white flex flex-col p-4 shadow-lg">
//       <h2 className="text-2xl font-bold text-center mb-6">Admin Panel</h2>
//       <nav className="flex-1">
//         <ul className="space-y-2">
//           <NavItem href="/" icon={<Home />} label="Dashboard" />
          
//           <DropdownNav label="Academic" icon={<LayoutGridIcon />} items={[
//             { href: "/admin/year", label: "Year View/Edit" },
//             { href: "/admin/semester", label: "Semester View/Edit" },
//             { href: "/admin/subject", label: "Subject View/Edit" },
//             { href: "/admin/grade_section", label: "Register Grade & Section" },
//             { href: "/admin/grade_section/edit", label: "Edit Grade & Section" },
//           ]}/>
//           <DropdownNav label="Students" icon={<Users />} items={[
//             { href: "/student/edit", label: "View/Edit Details" },
//             { href: "/student/register", label: "Register Student" },
            
//             { href: "/students/communication", label: "Parent Communication" }
//           ]} />


//           <DropdownNav label="Admin" icon={<Users />} items={[
//             { href: "/admin/register", label: "Register Staff" },
//             { href: "/admin/teacher", label: "Manage Teacher" },
//             { href: "/admin/teacher/assign", label: "Teacher Assign" },
//             { href: "/admin/teacher", label: "Class Assignments" },
            
//           ]} />

//           <DropdownNav label="Attendance" icon={<Calendar />} items={[
           
//             { href: "/admin/attendance", label: "Taking Staff Attendance" },
//             { href: "/admin/attendance/student", label: "Student Attendance Reports" }
//           ]} />

//           <DropdownNav label="Exams" icon={<Book />} items={[
//             { href: "/admin/exam/control", label: "Control Exams" },
//             { href: "/admin/exam/create", label: "Create Exam" },
//             { href: "/admin/exam/result", label: "Exam Result" },
//             { href: "/exams/reports", label: "Generate Report Cards" }
//           ]} />

//           <DropdownNav label="Fees" icon={<DollarSign />} items={[
//             { href: "/fees/payments", label: "Track Payments" },
//             { href: "/fees/invoices", label: "Generate Invoices" },
//             { href: "/fees/reminders", label: "Send Reminders" }
//           ]} />
//           <DropdownNav label="Parent" icon={<Users />} items={[
//             { href: "/parent", label: "List & Register Parent" },
//             { href: "/parent/edit", label: "Parent Edit" },
//           ]} />


//           <DropdownNav label="Reports" icon={<BarChart />} items={[
//             { href: "/reports/attendance", label: "Attendance Reports" },
//             { href: "/reports/academic", label: "Academic Reports" },
//             { href: "/reports/finance", label: "Financial Reports" }
//           ]} />

//           <NavItem href="/notifications" icon={<Bell />} label="Notifications" />
//         </ul>
//       </nav>
//     </div>
//   );
// };

// // Standard Nav Item (Without Dropdown)
// const NavItem = ({ href, icon, label }) => (
//   <li className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200">
//     {icon}
//     <Link href={href} className="text-lg">{label}</Link>
//   </li>
// );

// // Dropdown Menu for Sections with Sub-Links
// const DropdownNav = ({ label, icon, items }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <li>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex justify-between items-center w-full px-2 py-1 rounded-lg hover:bg-gray-700 transition-all duration-200"
//       >
//         <span className="flex items-center space-x-3">
//           {icon}
//           <span className="text-lg">{label}</span>
//         </span>
//         {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//       </button>

//       {isOpen && (
//         <ul className="ml-8 mt-1 space-y-1">
//           {items.map((item, index) => (
//             <li key={index}>
//               <Link href={item.href} className="block px-2 py-1 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200">
//                 {item.label}
//               </Link>
//             </li>
//           ))}
//         </ul>
//       )}
//     </li>
//   );
// };





"use client";
import {
  BarChart,
  Bell,
  Book,
  Calendar,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Home,
  LayoutGridIcon,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const Dashboard = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleDropdown = (label) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetch("/api/auth", { credentials: "include" });
        const data = await res.json();
        setRole(data.user.role);
      } catch {
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  const dropdowns = [
    {
      label: "Academic",
      icon: <LayoutGridIcon />,
      roles: ["admin", "head", "registrar"],
      items: [
        { href: "/admin/year", label: "Year View/Edit" },
        { href: "/admin/semester", label: "Semester View/Edit" },
        { href: "/admin/subject", label: "Subject View/Edit" },
        { href: "/admin/grade_section", label: "Register Grade & Section" },
        { href: "/admin/grade_section/edit", label: "Edit Grade & Section" },
      ],
    },
    {
      label: "Students",
      icon: <Users />,
      roles: ["admin", "head", "registrar"],
      items: [
        { href: "/admin/student/", label: "View/Edit Details" },
        { href: "/student/register", label: "Register Student" },
        { href: "/students/communication", label: "Parent Communication" },
      ],
    },
    {
      label: "Admin",
      icon: <Users />,
      roles: ["head"],
      items: [
        { href: "/admin/register", label: "Register Staff" },
        { href: "/admin/teacher/assign", label: "Assign Teacher" },
        { href: "/admin/teacher", label: "Class Assignments" },
      ],
    },
    {
      label: "Attendance",
      icon: <Calendar />,
      roles: ["admin", "head"],
      items: [
        { href: "/admin/attendance", label: "Taking Staff Attendance" },
        { href: "/admin/attendance/student", label: "Student Attendance Reports" },
      ],
    },
    {
      label: "Exams",
      icon: <Book />,
      roles: ["admin", "head", "registrar"],
      items: [
        { href: "/admin/exam/control", label: "Control Exams" },
        { href: "/admin/exam/create", label: "Create Exam" },
        { href: "/admin/exam/result", label: "Exam Result" },
      ],
    },
    {
      label: "Fees",
      icon: <DollarSign />,
      roles: ["admin"],
      items: [
        { href: "/fees/payments", label: "Track Payments" },
        { href: "/fees/invoices", label: "Generate Invoices" },
        { href: "/fees/reminders", label: "Send Reminders" },
      ],
    },
    {
      label: "Parent",
      icon: <Users />,
      roles: ["registrar"],
      items: [
        { href: "/parent", label: "List & Register Parent" },
        { href: "/parent/edit", label: "Parent Edit" },
      ],
    },
    {
      label: "Reports",
      icon: <BarChart />,
      roles: ["admin", "head"],
      items: [
        { href: "/reports/attendance", label: "Attendance Reports" },
        { href: "/reports/academic", label: "Academic Reports" },
        { href: "/reports/finance", label: "Financial Reports" },
      ],
    },
  ];

  if (loading) {
    return <div className="text-white p-4">Loading...</div>;
  }

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col p-4 shadow-lg relative">
      <h2 className="text-2xl font-bold text-center mb-6">Admin Panel</h2>

      <nav className="flex-1 flex flex-col justify-center">
        <ul className="space-y-2">
          <NavItem href="/" icon={<Home />} label="Dashboard" />

          {dropdowns
            .filter((dropdown) => dropdown.roles.includes(role))
            .map((dropdown) => (
              <DropdownNav
                key={dropdown.label}
                label={dropdown.label}
                icon={dropdown.icon}
                items={dropdown.items}
                isOpen={openDropdown === dropdown.label}
                onToggle={() => toggleDropdown(dropdown.label)}
              />
            ))}

          <NavItem href="/notifications" icon={<Bell />} label="Notifications" />
        </ul>
      </nav>
    </div>
  );
};

const NavItem = ({ href, icon, label }) => (
  <li className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200">
    {icon}
    <Link href={href} className="text-lg">
      {label}
    </Link>
  </li>
);

const DropdownNav = ({ label, icon, items, isOpen, onToggle }) => (
  <li>
    <button
      onClick={onToggle}
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
            <Link
              href={item.href}
              className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    )}
  </li>
);
