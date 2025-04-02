// "use client";
// import { useState } from "react";
// import { FaChevronDown } from "react-icons/fa";

// export default function StudentDashboard() {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   return (
//     <div className="h-screen bg-gray-100">
//       {/* Top Navbar */}
//     <div className="pt-16 flex flex-col items-center">
//         {/* Dropdown Menu */}
//         <div className="relative w-full max-w-sm px-4">
//           <button
//             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//             className="bg-blue-700 text-white px-4 py-2 flex items-center justify-between w-full rounded-lg"
//           >
//             <span>Student Services</span>
//             <FaChevronDown className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
//           </button>

//           {/* Dropdown List */}
//           {isDropdownOpen && (
//             <div className="bg-white shadow-lg rounded-lg w-full mt-2 transition-all duration-300">
//               <a href="#" className="block px-4 py-2 hover:bg-gray-200">Results</a>
//               <a href="#" className="block px-4 py-2 hover:bg-gray-200">Registration</a>
//               <a href="#" className="block px-4 py-2 hover:bg-gray-200">Attendance</a>
//               <a href="#" className="block px-4 py-2 hover:bg-gray-200">Fees</a>
//               <a href="#" className="block px-4 py-2 hover:bg-gray-200">Discipline</a>
//             </div>
//           )}
//         </div>

//         {/* Profile Card */}
//         <div className={`bg-white p-6 rounded-xl shadow-lg w-full max-w-sm mx-auto mt-${
//           isDropdownOpen ? "6" : "4"
//         } transition-all duration-300`}>
//           <h3 className="text-lg font-semibold text-blue-700">My Profile</h3>
//           <p><strong>Full Name:</strong> John Doe</p>
//           <p><strong>ID No:</strong> 123456</p>
//           <p><strong>Department:</strong> Computer Science</p>
//           <p><strong>Year:</strong> 3rd</p>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import StudentDashboard from "@/components/Student/Profile";
import { useState } from "react";
import { FaBars, FaEnvelope, FaHome, FaInfoCircle, FaSignInAlt, FaSignOutAlt, FaTimes, FaUser } from "react-icons/fa";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulated auth state

  const navLinks = [
    { name: "Home", href: "#", icon: <FaHome className="mr-2" /> },
    { name: "About", href: "#", icon: <FaInfoCircle className="mr-2" /> },
    { name: "Contact", href: "#", icon: <FaEnvelope className="mr-2" /> },
    { name: "Login", href: "#", icon: <FaSignInAlt className="mr-2" /> },
  ];

  // Add Logout if user is logged in
  const allLinks = isLoggedIn
    ? [
        ...navLinks.filter(link => link.name !== "Login"), 
        { 
          name: "Logout", 
          href: "#", 
          icon: <FaSignOutAlt className="mr-2" />,
          onClick: () => setIsLoggedIn(false) 
        }
      ]
    : navLinks;

  return (
    <div>
      
    <header className="bg-blue-900 text-white p-4 fixed w-full top-0 z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FaUser className="text-xl" />
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-100">
            School Portal
          </h2>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-2 items-center">
          {allLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="flex items-center px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 hover:scale-105 group"
              onClick={link.onClick}
            >
              {link.icon}
              <span className="group-hover:text-yellow-200 transition-colors">
                {link.name}
              </span>
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-2xl focus:outline-none p-2 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-blue-600 shadow-xl transition-all duration-300 animate-fadeIn">
          <div className="flex flex-col space-y-1 p-2">
            {allLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="flex items-center py-3 px-6 hover:bg-white/10 rounded-lg transition-all duration-200 active:scale-95"
                onClick={() => {
                  if (link.onClick) link.onClick();
                  setIsMobileMenuOpen(false);
                }}
              >
                {link.icon}
                <span className="ml-2">{link.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
    <StudentDashboard/>
    </div>


  );
}