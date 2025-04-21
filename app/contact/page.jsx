"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  FaEnvelope,
  FaFacebookF,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTelegramPlane,
  FaYoutube,
} from "react-icons/fa";

export default function ContactPage() {
  // States to hold form values and error/success messages
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [wordCountError, setWordCountError] = useState("");
  const [formStatus, setFormStatus] = useState(""); // For success or error message

  const wordLimit = 20; // Set the word limit for the message

  // Function to handle message input change
  const handleMessageChange = (e) => {
    const newMessage = e.target.value;
    const wordCount = newMessage.trim().split(/\s+/).length;

    if (wordCount <= wordLimit) {
      setMessage(newMessage);
      setWordCountError(""); // Clear error if the word count is within the limit
    } else {
      setWordCountError(`Message should be under ${wordLimit} words.`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (wordCountError) {
      return; // Prevent form submission if there is a word count error
    }

    // Data to send to API
    const formData = { name, email, message };

    try {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Success: Display success message
        setFormStatus("Your message has been sent successfully!");
        // Clear the form after successful submission
        setName("");
        setEmail("");
        setMessage("");
      } else {
        // Error: Display error message
        setFormStatus(`Error: ${data.message || "Something went wrong. Please try again."}`);
      }
    } catch (error) {
      // Handle network errors or any unexpected error
      setFormStatus("Error: Could not submit the message. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 text-white px-4 py-20 flex flex-col items-center">
      <div className="absolute inset-0 bg-black opacity-30"></div>

      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-4xl font-bold mb-6 text-center"
      >
        Contact Our School
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="relative z-10 text-center max-w-xl mb-12 text-lg text-gray-200"
      >
        Have a question, concern, or want to collaborate? Reach out to us!
      </motion.p>

      {/* Contact Cards */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="relative z-10 grid md:grid-cols-3 gap-8 mb-16 w-full max-w-5xl"
      >
        {[{ icon: <FaEnvelope className="text-red-400 text-3xl mb-2" />, title: "Email Us", detail: "school@example.com", href: "mailto:school@example.com" },
          { icon: <FaPhoneAlt className="text-green-400 text-3xl mb-2" />, title: "Call Us", detail: "+251 912 345 678", href: "tel:+251912345678" },
          { icon: <FaMapMarkerAlt className="text-yellow-300 text-3xl mb-2" />, title: "Visit Us", detail: "Addis Ababa, Ethiopia", href: "https://goo.gl/maps/yourlocation" },
        ].map((item, index) => (
          <a
            key={index}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-center bg-black bg-opacity-40 hover:bg-opacity-60 transition rounded-xl p-6 shadow-xl"
          >
            {item.icon}
            <h3 className="text-xl font-semibold mb-1 text-white">{item.title}</h3>
            <p className="text-gray-300 text-sm">{item.detail}</p>
          </a>
        ))}
      </motion.div>

      {/* Leave a Message Form */}
      <motion.form
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-2xl bg-black bg-opacity-40 p-8 rounded-2xl shadow-xl backdrop-blur-md space-y-5"
      >
        <h2 className="text-2xl font-semibold text-white mb-4 text-center">Leave Us a Message</h2>

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-md bg-white bg-opacity-20 text-black placeholder-gray-300 focus:outline-none"
        />
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-md bg-white bg-opacity-20 text-black placeholder-gray-300 focus:outline-none"
        />
        <textarea
          placeholder="Your Message"
          rows="5"
          value={message}
          onChange={handleMessageChange}
          className="w-full px-4 py-3 rounded-md bg-white bg-opacity-20 text-black placeholder-gray-300 focus:outline-none"
        ></textarea>

        {/* Display word count error if exceeded */}
        {wordCountError && <p className="text-red-500 text-sm">{wordCountError}</p>}

        {/* Display form submission status */}
        {formStatus && <p className="text-green-500 text-sm">{formStatus}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-md py-3 font-semibold text-white"
        >
          Send Message
        </button>
      </motion.form>

      {/* Footer Socials */}
      <motion.footer
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="relative z-10 mt-16 text-center text-white text-sm"
      >
        <div className="flex justify-center gap-6 text-xl mb-2">
          <a href="https://t.me/your_school" target="_blank" rel="noopener noreferrer">
            <FaTelegramPlane className="hover:text-blue-400 transition" />
          </a>
          <a href="https://facebook.com/your_school" target="_blank" rel="noopener noreferrer">
            <FaFacebookF className="hover:text-blue-300 transition" />
          </a>
          <a href="https://youtube.com/your_school" target="_blank" rel="noopener noreferrer">
            <FaYoutube className="hover:text-red-500 transition" />
          </a>
        </div>
        <p>&copy; {new Date().getFullYear()} Your School. All rights reserved.</p>
      </motion.footer>
    </div>
  );
}

