'use client';

import { motion } from 'framer-motion';
import { FaAward, FaChalkboardTeacher, FaFacebookF, FaTelegramPlane, FaUserGraduate, FaYoutube } from 'react-icons/fa';

const currentYear = new Date().getFullYear();

export default function HomePage() {
  return (
    <div className="relative bg-gradient-to-br from-blue-900 to-blue-600 min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Header Text Section */}
      <div className="relative z-10 flex flex-col items-center text-center text-white pt-24 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Welcome to Our School
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-lg sm:text-xl max-w-2xl"
        >
          We are committed to providing a nurturing environment where students thrive academically and personally.
        </motion.p>
      </div>

      {/* Info Cards Section */}
      <div className="relative z-10 mt-16 flex flex-wrap justify-center gap-6 px-4">
        {[
          {
            title: 'Students',
            text: 'Empowering over 1,200 students with quality education.',
            icon: <FaUserGraduate className="text-3xl text-blue-700" />,
            bg: 'bg-white',
          },
          {
            title: 'Staff',
            text: 'Dedicated and passionate educators fostering growth.',
            icon: <FaChalkboardTeacher className="text-3xl text-green-700" />,
            bg: 'bg-white',
          },
          {
            title: 'Reputation',
            text: 'Recognized among the top 10 schools in the region.',
            icon: <FaAward className="text-3xl text-yellow-600" />,
            bg: 'bg-white',
          },
        ].map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + index * 0.3, duration: 0.8 }}
            className={`rounded-2xl shadow-lg p-6 w-64 bg-opacity-90 ${card.bg}`}
          >
            <div className="mb-3">{card.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
            <p className="text-sm text-gray-700">{card.text}</p>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 left-0 right-0 text-center text-white text-sm z-10 px-4">
        <p className="mb-2">&copy; {currentYear} All rights reserved.</p>
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
