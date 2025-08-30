// "use client";
// import { QRCodeCanvas } from "qrcode.react";

// export default function StudentIDCard({ student }) {
//   return (
//     <div className="w-80 bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl rounded-2xl overflow-hidden border-4 border-white relative">
      
//       {/* Header */}
//       <div className="bg-white py-3 text-center text-blue-700 font-bold text-xl">
//         🎓 School ID Card
//       </div>

//       {/* Student Image */}
//       <div className="flex justify-center mt-4">
//         <img
//           src={student.image || "/default-avatar.png"}
//           alt={`${student.firstName} ${student.lastName}`}
//           className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
//         />
//       </div>

//       {/* Student Info */}
//       <div className="text-center mt-4">
//         <h2 className="text-2xl font-bold tracking-wide">
//           {student.firstName} {student.middleName} {student.lastName}
//         </h2>
//         <p className="text-sm opacity-90 mt-1">ID: {student.studentID}</p>
//       </div>

//       {/* QR Code */}
//       <div className="flex justify-center mt-4 mb-6">
//         <QRCodeCanvas
//           value={student.studentID}
//           size={100}
//           bgColor="#ffffff"
//           fgColor="#1e40af"
//           className="p-2 bg-white rounded-xl shadow-lg"
//         />
//       </div>

//       {/* Footer */}
//       <div className="bg-white text-blue-700 text-center py-2 text-sm font-semibold">
//         Academic Year {new Date().getFullYear()}
//       </div>
//     </div>
//   );
// }
"use client";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";

export default function StudentIDCard({ student }) {
  const cardRef = useRef();

  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;

    // Capture the card as canvas
    const canvas = await html2canvas(cardRef.current, { scale: 3 });
    const imgData = canvas.toDataURL("image/png");

    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${student.studentID}_IDCard.pdf`);
  };

  return (
    <div className="flex flex-col items-center">
      <div
        ref={cardRef}
        className="w-80 bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl rounded-2xl overflow-hidden border-4 border-white relative"
      >
        {/* Header */}
        <div className="bg-white py-3 text-center text-blue-700 font-bold text-xl">
          🎓 School ID Card
        </div>

        {/* Student Image */}
        <div className="flex justify-center mt-4">
          <img
            src={student.image || "/default-avatar.png"}
            alt={`${student.firstName} ${student.lastName}`}
            className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
          />
        </div>

        {/* Student Info */}
        <div className="text-center mt-4">
          <h2 className="text-2xl font-bold tracking-wide">
            {student.firstName} {student.middleName ?? ""} {student.lastName}
          </h2>
          <p className="text-sm opacity-90 mt-1">ID: {student.studentID}</p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mt-4 mb-6">
          <QRCodeCanvas
            value={student.studentID}
            size={100}
            bgColor="#ffffff"
            fgColor="#1e40af"
            className="p-2 bg-white rounded-xl shadow-lg"
          />
        </div>

        {/* Footer */}
        <div className="bg-white text-blue-700 text-center py-2 text-sm font-semibold">
          Academic Year {new Date().getFullYear()}
        </div>
      </div>

      {/* Download PDF Button */}
      <button
        onClick={handleDownloadPDF}
        className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-md transition"
      >
        Download PDF
      </button>
    </div>
  );
}
