"use client";

import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { FaAward, FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import { useTranslation } from "@/app/providers"; // ✅ import translation

export default function HomePage() {
  const { t } = useTranslation();

  const cards = [
    {
      title: t("students"),
      text: t("students_text"),
      icon: <FaUserGraduate className="text-4xl text-blue-600" />,
    },
    {
      title: t("staff"),
      text: t("staff_text"),
      icon: <FaChalkboardTeacher className="text-4xl text-green-600" />,
    },
    {
      title: t("reputation"),
      text: t("reputation_text"),
      icon: <FaAward className="text-4xl text-yellow-600" />,
    },
  ];

  return (
    <div>
      <div className="min-h-screen flex flex-col bg-white text-gray-800 font-serif">
        {/* Header Section */}
        <header className="flex flex-col items-center text-center pt-32 px-6 mb-20">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-yellow-600 to-black bg-clip-text text-transparent"
          >
            {t("welcome_message")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-lg sm:text-xl max-w-2xl text-gray-600"
          >
            {t("tagline")}
          </motion.p>
        </header>

        {/* Info Cards Section */}
        <section className="flex flex-wrap justify-center gap-10 px-6 mb-32">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.3, duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6 w-72 text-center"
            >
              <div className="mb-3">{card.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className="text-sm text-gray-700">{card.text}</p>
            </motion.div>
          ))}
        </section>
      </div>
      <Footer />
    </div>
  );
}
