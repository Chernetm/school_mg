
"use client";

import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import { useTranslation } from "@/app/providers"; // ✅ import translation

export default function ContactPage() {
  const { t } = useTranslation();

  const contactItems = [
    {
      icon: <FaEnvelope className="text-red-500 text-3xl mb-3" />,
      title: t("email_us"),
      detail: t("email_detail"),
      href: "mailto:daraaroschool@gmail.com",
    },
    {
      icon: <FaPhoneAlt className="text-green-600 text-3xl mb-3" />,
      title: t("call_us"),
      detail: t("phone_detail"),
      href: "tel:+251912345678",
    },
    {
      icon: <FaMapMarkerAlt className="text-yellow-500 text-3xl mb-3" />,
      title: t("visit_us"),
      detail: t("visit_detail"),
      href: "https://goo.gl/maps/yourlocation",
    },
  ];

  return (
    <div>
      <div className="min-h-screen bg-white text-gray-800 font-serif px-4 py-20 flex flex-col items-center">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-extrabold mb-6 text-center bg-gradient-to-r from-yellow-600 to-black bg-clip-text text-transparent"
        >
          {t("contact_header")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-center max-w-xl mb-16 text-lg text-gray-600"
        >
          {t("contact_subtext")}
        </motion.p>

        {/* Contact Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="grid md:grid-cols-3 gap-10 mb-20 w-full max-w-5xl"
        >
          {contactItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-center bg-white border border-gray-200 hover:shadow-xl transition rounded-2xl p-6"
            >
              {item.icon}
              <h3 className="text-xl font-semibold mb-1 text-gray-800">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">{item.detail}</p>
            </a>
          ))}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
