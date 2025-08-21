"use client";

import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import {
    FaEnvelope,
    FaFacebookF,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaTelegramPlane,
    FaYoutube,
} from "react-icons/fa";

export default function ContactPage() {
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
        Get in Touch with Daraaro Boarding School
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="text-center max-w-xl mb-16 text-lg text-gray-600"
      >
        Have questions, suggestions, or want to collaborate? We’d love to hear from you.
      </motion.p>

      {/* Contact Cards */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="grid md:grid-cols-3 gap-10 mb-20 w-full max-w-5xl"
      >
        {[
          {
            icon: <FaEnvelope className="text-red-500 text-3xl mb-3" />,
            title: "Email Us",
            detail: "daraaroschool@gmail.com",
            href: "mailto:school@example.com",
          },
          {
            icon: <FaPhoneAlt className="text-green-600 text-3xl mb-3" />,
            title: "Call Us",
            detail: "+251 912 345 678",
            href: "tel:+251912345678",
          },
          {
            icon: <FaMapMarkerAlt className="text-yellow-500 text-3xl mb-3" />,
            title: "Visit Us",
            detail: "Dilla, Ethiopia",
            href: "https://goo.gl/maps/yourlocation",
          },
        ].map((item, index) => (
          <a
            key={index}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-center bg-white border border-gray-200 hover:shadow-xl transition rounded-2xl p-6"
          >
            {item.icon}
            <h3 className="text-xl font-semibold mb-1 text-gray-800">{item.title}</h3>
            <p className="text-gray-600 text-sm">{item.detail}</p>
          </a>
        ))}
      </motion.div>
    </div>
    <Footer/>
    </div>
  );
}
