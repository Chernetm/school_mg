

"use client";
import {
  Book,
  Calendar,
  DollarSign,
  LayoutGridIcon,
  MessageCircleDashedIcon,
  Users
} from "lucide-react";
import { MdCampaign, MdDescription } from 'react-icons/md';



const dropdowns = [
    {
      label: "Academic",
      icon: <LayoutGridIcon />,
      roles: ["admin"],
      items: [
        { href: "/admin/subject", label: "Subject View/Edit" },
        { href: "/admin/grade_section", label: "Register Grade & Section" },
        { href: "/admin/grade_section/edit", label: "Edit Grade & Section" },
      ],
    },
    {
        label: "Admin",
        icon: <Users />,
        roles: ["admin"],
        items: [
          { href: "/admin/register", label: "Register Staff" },
          { href: "/admin/teacher/assign", label: "Assign Teacher" },
          { href: "/admin/teacher", label: "Class Assignments" },
        ],
      },
    {
        label: "Student",
        icon: <Users />,
        roles: ["admin"],
        items: [
          { href: "/admin/student/section", label: "Assign Section to Student" },
          { href: "/admin/rank", label: "Student Rank" },
          { href: "/admin/rank/academic", label: "Academic Rank" },
          { href: "/admin/student/list", label: "Student List" },
          { href: "/admin/rank/academic", label: "Academic Rank" },
        ],
      },
      {
        label: "Exams",
        icon: <Book />,
        roles: ["admin"],
        items: [
          { href: "/admin/exam/control", label: "Control Exams" },
          { href: "/admin/exam/create", label: "Create Exam" },
          { href: "/admin/exam/result", label: "Exam Result" },
        ],
      },
      {
        label: "Attendance",
        icon: <Calendar />,
        roles: ["admin"],
        items: [
          { href: "/admin/attendance", label: "Taking Staff Attendance" },
          { href: "/admin/attendance/student", label: "Student Attendance Reports" },
        ],
      },
      {
        label: "Transcript",
        icon: <MdDescription  />,
        roles: ["admin"],
        items: [
          { href: "/admin/student/transcript", label: "Transcript Print" },
        ],
      },
    {
      label: "Academic",
      icon: <LayoutGridIcon />,
      roles: ["head"],
      items: [
        { href: "/head/year", label: "Year View/Edit" },
        { href: "/head/semester", label: "Semester View/Edit" },
        ],
    },
    {
        label: "Announcement",
        icon: <MdCampaign/>,
        roles: ["head"],
        items: [
          { href: "/head/announcement/post", label: "Announcement Post" },
        ],
      },
    {
        label: "Admin",
        icon: <Users />,
        roles: ["head"],
        items: [
          { href: "/head/assign", label: "Assign Staff" },
          { href: "/head/attendance", label: "Attendance Record" },
        ],
      },
    
    {
      label: "Student",
      icon: <Users />,
      roles: ["head"],
      items: [
        { href: "/head/student/active", label: "Active Student" },
        { href: "/head/student/list", label: "Student List" },
        
      ],
    },
    {
        label: "Fees",
        icon: <DollarSign />,
        roles: ["head"],
        items: [
          { href: "/head/financial-summary", label: "Financial Record" },
          { href: "/head/unpaid-student", label: "List of Unpaid Student" },
        ],
      },
      {
        label: "Comment",
        icon: <MessageCircleDashedIcon />,
        roles: ["head"],
        items: [
          { href: "/head/message", label: "View Comment" },
          
        ],
      },

    {
      label: "Student",
      icon: <Users />,
      roles: ["registrar"],
      items: [
        { href: "/registrar/student", label: "Student Registration" },
        { href: "/registrar/student/list", label: "Student List" },
        { href: "/registrar/student/edit", label: "Edit Student" },
        
      ],
    },
    {
      label: "Parent",
      icon: <Users />,
      roles: ["registrar"],
      items: [
        { href: "/registrar/parent", label: "Parent Registration" },
        { href: "/registrar/parent/edit", label: "Edit Parent" },
        
      ],
    },

    // {
    //   label: "Reports",
    //   icon: <BarChart />,
    //   roles: ["admin", "head"],
    //   items: [
    //     { href: "/reports/attendance", label: "Attendance Reports" },
    //     { href: "/reports/academic", label: "Academic Reports" },
    //     { href: "/reports/finance", label: "Financial Reports" },
    //   ],
    // },
  ];

export default dropdowns;