"use client";

import { FaBell, FaChartBar, FaClipboardCheck, FaExclamationTriangle, FaFileAlt, FaFileInvoiceDollar, FaMoneyCheckAlt, FaPenAlt, FaUser } from "react-icons/fa";
import { MdSettings } from "react-icons/md";
import { useTranslation } from "@/app/providers";

const useStudentDropdowns = () => {
  const { t } = useTranslation();

  return [
    {
      label: t("student_services"),
      icon: null,
      roles: ["student"],
      items: [
        { href: "/student", label: t("profile"), icon: <FaUser /> },
        { href: "/student/announcement/grade", label: t("announcement"), icon: <FaBell /> },
        { href: "/student/result", label: t("results"), icon: <FaChartBar /> },
        { href: "/student/registration", label: t("registration"), icon: <FaFileAlt /> },
        { href: "/student/attendance", label: t("attendance"), icon: <FaClipboardCheck /> },
        { href: "/student/fee", label: t("fee_record"), icon: <FaFileInvoiceDollar /> },
        { href: "/fee", label: t("pay_fee"), icon: <FaMoneyCheckAlt /> },
        { href: "/student/discipline", label: t("discipline"), icon: <FaExclamationTriangle /> },
        { href: "/exam", label: t("exam_room"), icon: <FaPenAlt /> },
        { href: "/student/setting", label: t("setting"), icon: <MdSettings /> },
      ],
    },
  ];
};

export default useStudentDropdowns;
