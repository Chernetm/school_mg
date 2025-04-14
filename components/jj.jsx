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
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth", { credentials: "include" });
        const data = await res.json();
        setRole(data.role);
      } catch {
        setRole(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return <div className="text-white p-4">Loading...</div>;

  const handleToggle = (label) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  const renderDropdown = (label, icon, items) => (
    <li key={label}>
      <button
        onClick={() => handleToggle(label)}
        className="flex justify-between items-center w-full px-2 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200"
      >
        <span className="flex items-center space-x-3">
          {icon}
          <span className="text-lg">{label}</span>
        </span>
        {openDropdown === label ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {openDropdown === label && (
        <ul className="ml-8 mt-1 space-y-1">
          {items.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className="block px-2 py-1 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col p-4 shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Admin Panel</h2>
      <nav className="flex-1">
        <ul className="space-y-2">
          <NavItem href="/" icon={<Home />} label="Dashboard" />

          {renderDropdown("Academic", <LayoutGridIcon />, [
            { href: "/admin/year", label: "Year View/Edit" },
            { href: "/admin/semester", label: "Semester View/Edit" },
            { href: "/admin/subject", label: "Subject View/Edit" },
            { href: "/admin/grade_section", label: "Register Grade & Section" },
            { href: "/admin/grade_section/edit", label: "Edit Grade & Section" },
          ])}

          {renderDropdown("Students", <Users />, [
            { href: "/student/edit", label: "View/Edit Details" },
            { href: "/student/register", label: "Register Student" },
            { href: "/students/communication", label: "Parent Communication" },
          ])}

          {role === "head" &&
            renderDropdown("Admin", <Users />, [
              { href: "/admin/register", label: "Register Staff" },
              { href: "/admin/teacher", label: "Manage Teacher" },
              { href: "/admin/teacher/assign", label: "Teacher Assign" },
              { href: "/admin/teacher", label: "Class Assignments" },
            ])}

          {role === "admin" &&
            renderDropdown("Fees", <DollarSign />, [
              { href: "/fees/payments", label: "Track Payments" },
              { href: "/fees/invoices", label: "Generate Invoices" },
              { href: "/fees/reminders", label: "Send Reminders" },
            ])}

          {role === "registrar" &&
            renderDropdown("Parent", <Users />, [
              { href: "/parent", label: "List & Register Parent" },
              { href: "/parent/edit", label: "Parent Edit" },
            ])}

          {renderDropdown("Attendance", <Calendar />, [
            { href: "/admin/attendance", label: "Taking Staff Attendance" },
            { href: "/admin/attendance/student", label: "Student Attendance Reports" },
          ])}

          {renderDropdown("Exams", <Book />, [
            { href: "/admin/exam/control", label: "Control Exams" },
            { href: "/admin/exam/create", label: "Create Exam" },
            { href: "/admin/exam/result", label: "Exam Result" },
            { href: "/exams/reports", label: "Generate Report Cards" },
          ])}

          {renderDropdown("Reports", <BarChart />, [
            { href: "/reports/attendance", label: "Attendance Reports" },
            { href: "/reports/academic", label: "Academic Reports" },
            { href: "/reports/finance", label: "Financial Reports" },
          ])}

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
