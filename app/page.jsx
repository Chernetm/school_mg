"use client";

import { motion } from 'framer-motion';
import {
  FaAward,
  FaChalkboardTeacher,
  FaFacebookF,
  FaTelegramPlane,
  FaUserGraduate,
  FaYoutube,
} from 'react-icons/fa';

const currentYear = new Date().getFullYear();

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 font-serif">
      {/* Header Section */}
      <header className="flex flex-col items-center text-center pt-32 px-6 mb-20">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-yellow-600 to-black bg-clip-text text-transparent"
        >
          Welcome to Daraaro Boarding School
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-lg sm:text-xl max-w-2xl text-gray-600"
        >
          A premier destination for academic excellence and student growth.
        </motion.p>
      </header>

      {/* Info Cards Section */}
      <section className="flex flex-wrap justify-center gap-10 px-6 mb-32">
        {[
          {
            title: 'Students',
            text: 'Empowering over 230 students with quality education.',
            icon: <FaUserGraduate className="text-4xl text-blue-600" />,
          },
          {
            title: 'Staff',
            text: 'Dedicated and passionate educators fostering growth.',
            icon: <FaChalkboardTeacher className="text-4xl text-green-600" />,
          },
          {
            title: 'Reputation',
            text: 'Recognized among the top 3 schools in the region.',
            icon: <FaAward className="text-4xl text-yellow-600" />,
          },
        ].map((card, index) => (
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

      {/* Footer */}
      <footer className="relative z-10 text-center text-white text-sm py-6 px-4 bg-black bg-opacity-30">
        <p className="mb-2">&copy; {currentYear} Daraaro Boarding School. All rights reserved.</p>
        <div className="flex justify-center gap-4 text-xl">
          <a
            href="https://t.me/your_school_telegram"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition"
          >
            <FaTelegramPlane />
          </a>
          <a
            href="https://facebook.com/your_school_page"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-300 transition"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://youtube.com/your_school_channel"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-500 transition"
          >
            <FaYoutube />
          </a>
        </div>
      </footer>
    </div>
  );
}
