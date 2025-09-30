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
import { useTranslation } from "@/app/providers";
const useDropdowns = () => {
  const { t } = useTranslation();

  return [
    {
      label: t("announcement"),
      icon: <MdCampaign />,
      roles: ["admin"],
      items: [
        { href: "/admin/announcement/post", label: t("post_announcement") },
      ],
    },
    
    {
      label: t("admin"),
      icon: <Users />,
      roles: ["admin"],
      items: [
        { href: "/admin/register", label: t("register_staff") },
        { href: "/admin/teacher/assign", label: t("assign_teacher") },
        { href: "/admin/teacher", label: t("class_assignments") },
      ],
    },
    {
      label: t("student"),
      icon: <Users />,
      roles: ["admin"],
      items: [
        { href: "/admin/student/section", label: t("assign_section_student") },
        { href: "/admin/rank", label: t("student_rank") },
        { href: "/admin/student/list", label: t("student_list") },
      ],
    },
    {
      label: t("exams"),
      icon: <Book />,
      roles: ["admin"],
      items: [
        { href: "/admin/exam/control", label: t("realtime_detection") },
        { href: "/admin/exam", label: t("create_exam") },
        { href: "/admin/exam/result", label: t("exam_result") },
        { href: "/admin/exam/edit", label: t("edit_exam") },
      ],
    },
    {
      label: t("attendance"),
      icon: <Calendar />,
      roles: ["admin"],
      items: [
        { href: "/admin/attendance", label: t("staff_attendance") },
        { href: "/admin/attendance/student", label: t("student_attendance") },
      ],
    },
    {
      label: t("transcript"),
      icon: <MdDescription />,
      roles: ["admin"],
      items: [{ href: "/admin/student/transcript", label: t("transcript_print") }],
    },
    {
      label: t("academic"),
      icon: <LayoutGridIcon />,
      roles: ["head"],
      items: [
        
        { href: "/head/AcademicParameters", label: t("academicParameters") },
        
        ],
    },
    {
      label: t("announcement"),
      icon: <MdCampaign />,
      roles: ["head"],
      items: [{ href: "/head/announcement/post", label: t("announcement_post") }],
    },
    {
      label: t("admin"),
      icon: <Users />,
      roles: ["head"],
      items: [
        { href: "/head/assign", label: t("assign_staff") },
        { href: "/head/attendance", label: t("attendance_record") },
      ],
    },
    {
      label: t("student"),
      icon: <Users />,
      roles: ["head"],
      items: [
        { href: "/head/student/active", label: t("active_student") },
        { href: "/head/student/list", label: t("student_list") },
        { href: "/head/student/deactivate", label: t("deactivate_student") },
      ],
    },
    {
      label: t("payment"),
      icon: <DollarSign />,
      roles: ["admin"],
      items: [{ href: "/admin/payment", label: t("payment_form") }],
    },
    {
      label: t("fees"),
      icon: <DollarSign />,
      roles: ["head"],
      items: [
        { href: "/head/financial-summary", label: t("financial_record") },
        { href: "/head/unpaid-student", label: t("unpaid_students") },
      ],
    },
    {
      label: t("comment"),
      icon: <MessageCircleDashedIcon />,
      roles: ["head"],
      items: [{ href: "/head/message", label: t("view_comment") }],
    },
    {
      label: t("student"),
      icon: <Users />,
      roles: ["registrar"],
      items: [
        { href: "/registrar/student", label: t("student_registration") },
        { href: "/registrar/student/list", label: t("student_list") },
        { href: "/registrar/student/edit", label: t("edit_student") },
      ],
    },
    {
      label: t("parent"),
      icon: <Users />,
      roles: ["registrar"],
      items: [
        { href: "/registrar/parent", label: t("parent_registration") },
        { href: "/registrar/parent/edit", label: t("edit_parent") },
      ],
    },
  ];
};

export default useDropdowns;



// "use client";
// import {
//   Book,
//   Calendar,
//   DollarSign,
//   LayoutGridIcon,
//   MessageCircleDashedIcon,
//   Users
// } from "lucide-react";
// import { MdCampaign, MdDescription } from 'react-icons/md';



// const dropdowns = [
//      {
//         label: "Announcement",
//         icon: <MdCampaign/>,
//         roles: ["admin"],
//         items: [
//           { href: "/admin/announcement/post", label: "Post Announcement" },
//         ],
//       },
//     {
//       label: "Academic",
//       icon: <LayoutGridIcon />,
//       roles: ["admin"],
//       items: [
//         { href: "/admin/subject", label: "Subject View/Edit" },
//         { href: "/admin/grade_section", label: "Register Grade & Section" },
//         { href: "/admin/grade_section/edit", label: "Edit Grade & Section" },
//       ],
//     },
//     {
//         label: "Admin",
//         icon: <Users />,
//         roles: ["admin"],
//         items: [
//           { href: "/admin/register", label: "Register Staff" },
//           { href: "/admin/teacher/assign", label: "Assign Teacher" },
//           { href: "/admin/teacher", label: "Class Assignments" },
//         ],
//       },
//     {
//         label: "Student",
//         icon: <Users />,
//         roles: ["admin"],
//         items: [
//           { href: "/admin/student/section", label: "Assign Section to Student" },
//           { href: "/admin/rank", label: "Student Rank" },
//           { href: "/admin/rank/academic", label: "Academic Rank" },
//           { href: "/admin/student/list", label: "Student List" },
//           { href: "/admin/rank/academic", label: "Academic Rank" },
          
//         ],
//       },
//       {
//         label: "Exams",
//         icon: <Book />,
//         roles: ["admin"],
//         items: [
//           { href: "/admin/exam/control", label: "Realtime Detection" },
//           { href: "/admin/exam", label: "Create Exam" },
//           { href: "/admin/exam/result", label: "Exam Result" },
//           { href: "/admin/exam/edit", label: "Edit Exam" },
//         ],
//       },
//       {
//         label: "Attendance",
//         icon: <Calendar />,
//         roles: ["admin"],
//         items: [
//           { href: "/admin/attendance", label: "Taking Staff Attendance" },
//           { href: "/admin/attendance/student", label: "Student Attendance Reports" },
//         ],
//       },
//       {
//         label: "Transcript",
//         icon: <MdDescription  />,
//         roles: ["admin"],
//         items: [
//           { href: "/admin/student/transcript", label: "Transcript Print" },
//         ],
//       },
//     {
//       label: "Academic",
//       icon: <LayoutGridIcon />,
//       roles: ["head"],
//       items: [
//         { href: "/head/year", label: "Year View/Edit" },
//         { href: "/head/semester", label: "Semester View/Edit" },
//         ],
//     },
//     {
//         label: "Announcement",
//         icon: <MdCampaign/>,
//         roles: ["head"],
//         items: [
//           { href: "/head/announcement/post", label: "Announcement Post" },
//         ],
//       },
//     {
//         label: "Admin",
//         icon: <Users />,
//         roles: ["head"],
//         items: [
//           { href: "/head/assign", label: "Assign Staff" },
//           { href: "/head/attendance", label: "Attendance Record" },
//         ],
//       },
    
//     {
//       label: "Student",
//       icon: <Users />,
//       roles: ["head"],
//       items: [
//         { href: "/head/student/active", label: "Active Student" },
//         { href: "/head/student/list", label: "Student List" },
//         { href: "/head/student/deactivate", label: "Deactivate" },
        
//       ],
//     },

//     {
//       label:"Payment",
//       icon:<DollarSign/>,
//       roles:["admin"],
//       items:[
//         {href:"/admin/payment", label:"Payment Form"},
//       ]
//     },
//     {
//         label: "Fees",
//         icon: <DollarSign />,
//         roles: ["head"],
//         items: [
//           { href: "/head/financial-summary", label: "Financial Record" },
//           { href: "/head/unpaid-student", label: "List of Unpaid Student" },
//         ],
//       },
//       {
//         label: "Comment",
//         icon: <MessageCircleDashedIcon />,
//         roles: ["head"],
//         items: [
//           { href: "/head/message", label: "View Comment" },
          
//         ],
//       },

//     {
//       label: "Student",
//       icon: <Users />,
//       roles: ["registrar"],
//       items: [
//         { href: "/registrar/student", label: "Student Registration" },
//         { href: "/registrar/student/list", label: "Student List" },
//         { href: "/registrar/student/edit", label: "Edit Student" },
        
//       ],
//     },
//     {
//       label: "Parent",
//       icon: <Users />,
//       roles: ["registrar"],
//       items: [
//         { href: "/registrar/parent", label: "Parent Registration" },
//         { href: "/registrar/parent/edit", label: "Edit Parent" },
        
//       ],
//     },

//     // {
//     //   label: "Reports",
//     //   icon: <BarChart />,
//     //   roles: ["admin", "head"],
//     //   items: [
//     //     { href: "/reports/attendance", label: "Attendance Reports" },
//     //     { href: "/reports/academic", label: "Academic Reports" },
//     //     { href: "/reports/finance", label: "Financial Reports" },
//     //   ],
//     // },
//   ];

// export default dropdowns;
