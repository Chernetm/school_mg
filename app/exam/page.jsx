// "use client";

// import { motion } from "framer-motion";
// import Link from "next/link";
// import {
//   MdAssignment,
//   MdBarChart,
//   MdComputer,
//   MdPerson,
//   MdSettings,
// } from "react-icons/md"; // Added MdPerson icon

// const containerVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       staggerChildren: 0.2,
//       duration: 0.6,
//       ease: "easeOut",
//     },
//   },
// };

// const cardVariants = {
//   hidden: { opacity: 0, y: 30 },
//   visible: { opacity: 1, y: 0 },
// };

// export default function Dashboard() {
//   return (
//     <div className="min-h-screen bg-gray-100 text-white p-6 flex flex-col items-center justify-center">
//       <motion.h1
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="text-3xl font-bold mb-8 text-black text-center"
//       >
//         Exam Dashboard
//       </motion.h1>

//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl"
//       >
//         {/* Real-time Online Exam */}
//         <Card
//           href="/exam/online"
//           title="Real-time Online Exam"
//           description="Start and monitor live exams"
//           icon={<MdComputer size={28} />}
//         />

//         {/* Model Exam */}
//         <Card
//           href="/exam/model"
//           title="Model Exam"
//           description="Take model exams"
//           icon={<MdAssignment size={28} />}
//         />

//         {/* Exam Result */}
//         <Card
//           href="/exam/result"
//           title="Exam Result"
//           description="View and publish student results"
//           icon={<MdBarChart size={28} />}
//         />
//       </motion.div>
//     </div>
//   );
// }

// function Card({ href, title, description, icon }) {
//   return (
//     <motion.div
//       variants={cardVariants}
//       whileHover={{ scale: 1.05 }}
//       whileTap={{ scale: 0.97 }}
//       className="bg-white text-blue-800 p-6 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all"
//     >
//       <Link href={href}>
//         <div className="flex items-center space-x-4">
//           <div className="bg-blue-200 p-4 rounded-full">{icon}</div>
//           <div>
//             <h2 className="text-xl font-semibold">{title}</h2>
//             <p className="text-sm">{description}</p>
//           </div>
//         </div>
//       </Link>
//     </motion.div>
//   );
// }
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  MdAssignment,
  MdBarChart,
  MdComputer,
} from "react-icons/md";

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
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-10 text-center text-blue-900"
      >
        Exam Dashboard
      </motion.h1>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl"
      >
        {/* Real-time Online Exam */}
        <Card
          href="/exam/online"
          title="Real-time Online Exam"
          description="Start and monitor live exams"
          icon={<MdComputer size={28} />}
        />

        {/* Model Exam */}
        <Card
          href="/exam/model"
          title="Model Exam"
          description="Take model exams"
          icon={<MdAssignment size={28} />}
        />

        {/* Exam Result */}
        <Card
          href="/exam/result"
          title="Exam Result"
          description="View and publish student results"
          icon={<MdBarChart size={28} />}
        />
      </motion.div>
    </div>
  );
}

function Card({ href, title, description, icon }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className="bg-white text-blue-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all"
    >
      <Link href={href}>
        <div className="flex items-start space-x-4">
          <div className="bg-blue-100 p-3 rounded-full">{icon}</div>
          <div>
            <h2 className="text-lg lg:text-xl font-semibold">{title}</h2>
            <p className="text-sm lg:text-base text-gray-700">{description}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
