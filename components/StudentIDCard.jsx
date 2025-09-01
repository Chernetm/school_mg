// "use client";
// import { QRCodeCanvas } from "qrcode.react";

// export default function StudentIDCard({ student }) {
//   return (
//     <div className="w-96 bg-white shadow-xl rounded-md overflow-hidden border border-gray-300">

//       {/* Header Section */}
//       <div className="bg-orange-500 text-white text-center py-1 font-bold text-lg">
//         Chelelektu Secondary School
//       </div>

//       {/* Body Section (3-column layout) */}
//       <div className="p-4 grid grid-cols-3 gap-4 items-center">
//         {/* Student Image */}
//         <div className="flex justify-center">
//           <img
//             src={student.image || "/default-avatar.png"}
//             alt="Student"
//             className="w-20 h-24 rounded-sm object-cover border"
//           />
//         </div>

//         {/* Student Info */}
//         <div className="text-sm text-gray-800">
//           <p><span className="font-semibold">ID:</span> {student.studentID}</p>
//           <p><span className="font-semibold">Year:</span> {student.registrations?.[0].year}</p>
//           <p><span className="font-semibold">Grade:</span> {student.registrations?.[0].grade}</p>
//           <p><span className="font-semibold">Section:</span> {student.registrations?.[0].section}</p>
//         </div>

//         {/* QR Code */}
//         <div className="flex justify-center">
//           <QRCodeCanvas
//             value={student.studentID}
//             size={75}
//             bgColor="#ffffff"
//             fgColor="#1e40af"
//             className="p-2 bg-white rounded-xl shadow-lg"
//           />
//         </div>
//       </div>

//       {/* Name Highlight */}
//       <div className="bg-gray-100 px-1 py-1 text-orange-600 font-bold text-sm text-center">
//         {student.firstName} {student.middleName} {student.lastName}
//       </div>

//       {/* Signature Area */}
//       <div className="px-4 pb-4 text-gray-500 text-xs italic text-right">
//         Authorized Signature
//       </div>
//     </div>
//   );
// }

"use client";
import { QRCodeCanvas } from "qrcode.react";

// export default function StudentIDCard({ student }) {
//   return (
//     <div
//       className="
//         w-96 bg-white shadow-xl rounded-md overflow-hidden border border-gray-300
//         print:w-[420px] print:h-[260px] print:mx-2 print:my-2
//         print:shadow-none
//       "
//     >
//       {/* Header */}
//       <div className="bg-orange-500 text-white text-center py-1 font-bold text-lg">
//         Chelelektu Secondary School
//       </div>

//       {/* Body */}
//       <div className="p-4 grid grid-cols-3 gap-4 items-center">
//         {/* Student Image */}
//         <div className="flex justify-center">
//           <img
//             src={student.image || "/default-avatar.png"}
//             alt="Student"
//             className="w-20 h-24 rounded-sm object-cover border"
//           />
//         </div>

//         {/* Info */}
//         <div className="text-sm text-gray-800">
//           <p><span className="font-semibold">ID:</span> {student.studentID}</p>
//           <p><span className="font-semibold">Year:</span> {student.registrations?.[0].year}</p>
//           <p><span className="font-semibold">Grade:</span> {student.registrations?.[0].grade}</p>
//           <p><span className="font-semibold">Section:</span> {student.registrations?.[0].section}</p>
//         </div>

//         {/* QR */}
//         <div className="flex justify-center">
//           <QRCodeCanvas
//             value={student.studentID}
//             size={75}
//             bgColor="#ffffff"
//             fgColor="#1e40af"
//             className="p-2 bg-white rounded-xl shadow-lg"
//           />
//         </div>
//       </div>

//       {/* Name */}
//       <div className="bg-gray-100 px-1 py-1 text-orange-600 font-bold text-sm text-center">
//         {student.firstName} {student.middleName} {student.lastName}
//       </div>
//     </div>
//   );
// }


export default function StudentIDCard({ student }) {
  return (
    <div
  className="
    w-96 bg-white shadow-xl rounded-md overflow-hidden border border-gray-300
    print:w-[350px] print:h-[220px] print:scale-125 print:mx-4 print:my-4
    print:shadow-none
  "
>


      {/* Header Section */}
      <div className="bg-orange-500 text-white text-center py-1 font-bold text-lg">
        Chelelektu Secondary School
      </div>

      {/* Body Section */}
      <div className="p-4 grid grid-cols-3 gap-4 items-center">
        {/* Student Image */}
        <div className="flex justify-center">
          <img
            src={student.image || "/default-avatar.png"}
            alt="Student"
            className="w-20 h-24 rounded-sm object-cover border"
          />
        </div>

        {/* Student Info */}
        <div className="text-sm text-gray-800">
          <p><span className="font-semibold">ID:</span> {student.studentID}</p>
          <p><span className="font-semibold">Year:</span> {student.registrations?.[0].year}</p>
          <p><span className="font-semibold">Grade:</span> {student.registrations?.[0].grade}</p>
          <p><span className="font-semibold">Section:</span> {student.registrations?.[0].section}</p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center">
          <QRCodeCanvas
            value={student.studentID}
            size={75}
            bgColor="#ffffff"
            fgColor="#1e40af"
            className="p-2 bg-white rounded-xl shadow-lg"
          />
        </div>
      </div>

      {/* Name Highlight */}
      <div className="bg-gray-100 px-1 py-1 text-orange-600 font-bold text-sm text-center">
        {student.firstName} {student.middleName} {student.lastName}
      </div>

      {/* Signature Area */}
      <div className="px-4 pb-4 text-gray-500 text-xs italic text-right">
        Authorized Signature
      </div>
    </div>
  );
}
