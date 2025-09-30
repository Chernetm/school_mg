
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

const Footer = () => {
    return ( <div>
        <footer className="relative z-10 text-center text-white text-sm py-6 px-4 bg-black bg-opacity-30">
                <p className="mb-2">&copy; {currentYear} South West Academy. All rights reserved.</p>
                <div className="flex justify-center gap-4 text-xl">
                  <a
                    href="https://t.me/Swa01"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition"
                  >
                    <FaTelegramPlane />
                  </a>
                  <a
                    href="https://web.facebook.com/SWAethio/"
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
    </div> );
}
 
export default Footer;