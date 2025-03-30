"use client";
import { useEffect, useState } from "react";

export default function StaffAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    // Fetch staff assignments from the backend
    fetch("/api/staff/teacher_section")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.assignments) {
          setAssignments(data.assignments);
        } else {
          setAssignments([]); // Handle if no assignments are available
        }
      });
  }, []);

  const fetchStudents = async (grade, section) => {
    try {
      const response = await fetch(`/api/student/filter?grade=${grade}&section=${section}`, {
        method: "GET", // Explicitly stating it's a GET request
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch students");
      }

      setStudents(data.students);  // Ensure that you set the correct student data
    } catch (error) {
      console.error("Error fetching students:", error.message);
      setStudents([]);
    }
  };

  const handleCardClick = (assignment) => {
    setSelectedAssignment(assignment);
    fetchStudents(assignment.grade, assignment.section);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setStudents([]);
    setSelectedAssignment(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Staff Assignments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.length > 0 ? (
          assignments.map((assignment) => (
            <div
              key={`${assignment.grade}-${assignment.section}-${assignment.subject}`}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer"
              onClick={() => handleCardClick(assignment)}
            >
              <h2 className="text-xl font-semibold text-gray-800">{assignment.subject}</h2>
              <p className="text-gray-600">Grade: {assignment.grade}</p>
              <p className="text-gray-600">Section: {assignment.section}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No assignments available</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Students for {selectedAssignment.subject}
            </h2>
            <p className="mb-2 text-gray-700">
              <strong>Grade:</strong> {selectedAssignment.grade}
            </p>
            <p className="mb-4 text-gray-700">
              <strong>Section:</strong> {selectedAssignment.section}
            </p>

            {/* Styled Student List */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-gray-900">
                    <th className="border border-gray-300 px-4 py-2">Student ID</th>
                    <th className="border border-gray-300 px-4 py-2">Name</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(students) && students.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="text-center border border-gray-300 px-4 py-2 text-gray-600">
                        No students found.
                      </td>
                    </tr>
                  ) : (
                    Array.isArray(students) &&
                    students.map((student) => (
                      <tr key={student.studentID} className="text-gray-800 even:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">{student.studentID}</td>
                        <td className="border border-gray-300 px-4 py-2">{student.firstName} {student.lastName}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <button
              onClick={closeModal}
              className="mt-4 w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
