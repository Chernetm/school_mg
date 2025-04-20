"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaBullhorn, FaChalkboardTeacher } from "react-icons/fa";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-blue-800 text-white p-6 flex flex-col items-center justify-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold mb-8 text-center"
      >
        Teacher Dashboard
      </motion.h1>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl"
      >
        {/* 📢 Announcements Card */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="bg-white text-blue-800 p-6 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all"
        >
          <Link href="/teacher/announcement/post">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-200 p-4 rounded-full">
                <FaBullhorn size={28} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Announcement Post</h2>
                <p className="text-sm">Post announcement for student</p>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* 🧑‍🏫 Section List Card */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="bg-white text-blue-800 p-6 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all"
        >
          <Link href="/teacher/section">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-200 p-4 rounded-full">
                <FaChalkboardTeacher size={28} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Section List</h2>
                <p className="text-sm">Manage your assigned classes attendance and student result</p>
              </div>
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
