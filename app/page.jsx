"use client";

import { useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { FaAward, FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import { useTranslation } from "@/app/providers"; // ✅ import translation

export default function HomePage() {
  const [programIndex, setProgramIndex] = useState(0);
  const [teamIndex, setTeamIndex] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const visibleCount = isMobile ? 1 : 3;


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
  const contactItems = [
    {
      icon: <FaEnvelope className="text-red-500 text-4xl mb-4" />,
      title: t("email_us"),
      detail: t("email_detail"),
      href: "mailto:daraaroschool@gmail.com",
    },
    {
      icon: <FaPhoneAlt className="text-green-600 text-4xl mb-4" />,
      title: t("call_us"),
      detail: t("phone_detail"),
      href: "tel:+251912345678",
    },
    {
      icon: <FaMapMarkerAlt className="text-yellow-500 text-4xl mb-4" />,
      title: t("visit_us"),
      detail: t("visit_detail"),
      href: "https://goo.gl/maps/yourlocation",
    },
  ];


  const teams = [
    {
      name: 'Tech Club',
      img: 'techClub.png',
      desc: 'The Tech Club is a space for students who are passionate about innovation and technology. Members learn coding, robotics, and digital design through workshops and projects. The club also participates in inter-school tech fairs and competitions. It encourages problem-solving and creativity using modern tools.'
    },
    {
      name: 'Football Club',
      img: 'footballClub.png',
      desc: 'The Football Club trains students in teamwork, leadership, and discipline through sports. Members practice regularly and compete in local and regional tournaments. The club promotes physical fitness and sportsmanship. It also helps players develop confidence and perseverance both on and off the field.'
    },
    {
      name: 'Culture Club',
      img: 'cultureClub.png',
      desc: 'The Culture Club celebrates diversity and heritage through art, music, dance, and drama. Members organize events that highlight various cultural traditions and values. The club fosters creativity, inclusiveness, and respect for all backgrounds. It plays a key role in school ceremonies and cultural festivals.'
    },
    {
      name: 'Traffic Road Club',
      img: 'trafficClub.png',
      desc: 'The Traffic Road Club raises awareness about road safety and responsible behavior. Students learn about traffic rules, signs, and first aid. The club conducts campaigns to educate others on accident prevention. It aims to create safer communities through knowledge and civic responsibility.'
    }
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Weekly Program Controls
  const prevProgram = () => {
    setProgramIndex((prev) => prev - 1);
  };
  const nextProgram = () => {
    setProgramIndex((prev) => prev + 1);
  };

  // Team Controls
  const prevTeam = () => {
    setTeamIndex((prev) => prev - 1);
  };
  const nextTeam = () => {
    setTeamIndex((prev) => prev + 1);
  };



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

        <section id="club" className="py-10 sm:py-20 px-3 sm:px-20 relative">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10 text-indigo-700">{t('teams')}</h2>

          <div className="overflow-hidden relative w-full">
            <motion.div
              animate={{ x: `-${(teamIndex % teams.length) * (100 / visibleCount)}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="flex w-full"
            >
              {[...teams, ...teams].map((team, i) => (
                <div key={i} className="flex-shrink-0 w-full sm:w-1/3 px-1 sm:px-2">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <img src={team.img} alt={team.name} className="w-full h-36 sm:h-48 object-cover" />
                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold text-base sm:text-lg text-indigo-700">{team.name}</h3>
                      <p className={`text-gray-600 text-xs sm:text-sm mt-1 sm:mt-2 ${expandedIndex === i ? "" : "line-clamp-2"}`}>
                        {team.desc}
                      </p>
                      <Button
                        onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                        className="mt-3 sm:mt-4 w-full flex justify-center items-center gap-1 sm:gap-2 bg-indigo-600 hover:bg-indigo-700 text-xs sm:text-sm"
                      >
                        {expandedIndex === i ? "Show Less" : "Read More"} <ArrowRight size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Arrows */}
            <button onClick={prevTeam} className="absolute top-1/2 left-1 sm:left-4 -translate-y-1/2 bg-indigo-600 text-white p-1.5 sm:p-2 rounded-full shadow-md hover:bg-indigo-700">
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextTeam} className="absolute top-1/2 right-1 sm:right-4 -translate-y-1/2 bg-indigo-600 text-white p-1.5 sm:p-2 rounded-full shadow-md hover:bg-indigo-700">
              <ChevronRight size={20} />
            </button>
          </div>
        </section>
        <section id="contact" className="py-10 sm:py-20 px-3 sm:px-20 flex flex-col items-center text-center scroll-mt-20">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r from-yellow-600 to-indigo-800 bg-clip-text text-transparent"
          >
            {t("contact_us")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="max-w-md sm:max-w-2xl mb-10 sm:mb-16 text-sm sm:text-lg text-gray-600"
          >
            {t("contact_subtext")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-10 w-full max-w-6xl"
          >
            {contactItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center text-center bg-white rounded-xl p-4 sm:p-8 border border-gray-200 shadow-md hover:shadow-xl transition"
              >
                {item.icon}
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-indigo-700">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">{item.detail}</p>
              </a>
            ))}
          </motion.div>
        </section>

      </div>
      <Footer />
    </div>
  );
}
