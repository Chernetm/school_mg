"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaBook, FaClipboardList, FaUserGraduate } from "react-icons/fa";
import { MdLibraryAdd } from "react-icons/md";

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

export default function LibrarySection() {
  return (
    <div className="min-h-screen bg-blue-800 text-white p-6 flex flex-col items-center justify-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold mb-8 text-center"
      >
        📚 Library Dashboard
      </motion.h1>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl"
      >
        {/* Book Register */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="bg-white text-blue-800 p-6 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all"
        >
          <Link href="/library/register">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-200 p-4 rounded-full">
                <MdLibraryAdd size={28} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Register Book</h2>
                <p className="text-sm">Add new books to the library</p>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Book Borrow */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="bg-white text-blue-800 p-6 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all"
        >
          <Link href="/library/borrow">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-200 p-4 rounded-full">
                <FaClipboardList size={28} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Borrow Book</h2>
                <p className="text-sm">Issue book to student</p>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Book List */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="bg-white text-blue-800 p-6 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all"
        >
          <Link href="/library/book">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-200 p-4 rounded-full">
                <FaBook size={28} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Book List</h2>
                <p className="text-sm">View all registered books</p>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Borrowed Students List */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="bg-white text-blue-800 p-6 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all"
        >
          <Link href="/library/borrow/list">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-200 p-4 rounded-full">
                <FaUserGraduate size={28} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Borrowed List</h2>
                <p className="text-sm">See who borrowed which books</p>
              </div>
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
