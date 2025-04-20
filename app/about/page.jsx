"use client";

import { motion } from 'framer-motion';
import {
    FaEnvelope,
    FaInfoCircle,
    FaLinkedin,
    FaProjectDiagram,
    FaTelegramPlane
} from 'react-icons/fa';


const currentYear = new Date().getFullYear();

export default function AboutPage() {
    return (
        <div className="relative bg-gradient-to-br from-purple-900 to-indigo-700 min-h-screen flex flex-col text-white">
            <div className="absolute inset-0 bg-black opacity-30"></div>

            {/* Header & Personal Info */}
            <header className="relative z-10 text-center pt-24 px-4 mb-16">
                <motion.h1
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-4xl md:text-5xl font-bold mb-4"
                >
                    About Me & This Project
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-lg max-w-3xl mx-auto mb-10"
                >
                    Get to know more about me, my work, and the project that powers this platform.
                </motion.p>

                {/* Personal Info Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="flex flex-col md:flex-row items-center gap-6 max-w-4xl mx-auto px-4"
                >
                    <img
                        src="https://res.cloudinary.com/dsa1gjnyd/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1745088766/admin_profiles/ac4nf0ttwhmhc9ixddrh.jpg"
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-purple-400"
                    />
                    <div className="text-left">
                        <h2 className="text-2xl font-semibold text-white mb-2">Chernet Mekuria</h2>
                        <p className="text-sm md:text-base text-gray-200">
                            I'm a 4th year Electrical and Computer Engineering student at Addis Ababa University.
                            I'm a full stack developer and data analyst dedicated to building meaningful digital tools.
                        </p>
                    </div>
                </motion.div>

            </header>

            {/* Cards Section */}
            <section className="relative z-10 px-4 flex flex-col lg:flex-row gap-8 justify-center items-start mb-20 mt-20">
                {/* Projects Card */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                    className="bg-white bg-opacity-90 rounded-2xl shadow-lg p-6 w-full max-w-md text-gray-800"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <FaProjectDiagram className="text-green-600 text-2xl" />
                        <h3 className="text-xl font-semibold">Projects</h3>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Grade 6 Regional Exam Result Portal</li>
                        <li>E-learning Desktop App</li>
                        <li>E-commerce Marketing Platform</li>
                        <li>Encryption and Decryption Platform</li>
                        <li>Game Development using Godot</li>
                        <li>Won African VEX Robotics Competition 2025</li>
                    </ul>
                </motion.div>

                {/* About Project Card */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8, duration: 0.8 }}
                    className="bg-white bg-opacity-90 rounded-2xl shadow-lg p-6 w-full max-w-md text-gray-800"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <FaInfoCircle className="text-purple-600 text-2xl" />
                        <h3 className="text-xl font-semibold">About This Project</h3>
                    </div>
                    <p className="text-sm mb-2">
                        This platform is a complete school management system designed to work smoothly and efficiently.
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Online Exams & School Fee Payment</li>

                        <li>Parent Control Panel & Financial Record Keeping</li>


                        <li>Attendance Tracking & Announcements System</li>
                        <li>Student Results & Role-based Management</li>

                    </ul>
                </motion.div>
            </section>

            <footer className="relative z-10 text-center text-white text-sm py-6 px-4 bg-black bg-opacity-30">
                <p className="mb-2">&copy; {currentYear} All rights reserved.</p>
                <div className="flex justify-center gap-4 text-xl">
                    <a
                        href="https://t.me/https://t.me/cherexc"
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
                        <FaLinkedin />
                    </a>
                    <a
                        href="mailto:chernetmekuria379@gmail.com"
                        className="hover:text-red-500 transition text-xl"
                    >
                        <FaEnvelope />
                    </a>

                </div>
            </footer>
        </div>
    );
}
