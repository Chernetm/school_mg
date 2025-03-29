"use client"
import { useEffect, useState } from 'react';

export default function StaffAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    // Fetch staff assignments from the backend
    fetch('/api/staff/teacher_section')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.assignments) {
          setAssignments(data.assignments);
        } else {
          setAssignments([]);  // Handle if no assignments are available
        }
      });
  }, []);

  const fetchStudents = async (grade, section, subject) => {
    // Fetch students based on selected grade, section, and subject
    const response = await fetch(`/api/students?grade=${grade}&section=${section}&subject=${subject}`);
    const data = await response.json();
    setStudents(data);
  };

  const handleCardClick = (assignment) => {
    setSelectedAssignment(assignment);
    fetchStudents(assignment.grade, assignment.section, assignment.subject);
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
          assignments.map((assignment, index) => (
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
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">Students for {selectedAssignment.subject}</h2>
            <p className="mb-4">
              <strong>Grade:</strong> {selectedAssignment.grade}
            </p>
            <p className="mb-4">
              <strong>Section:</strong> {selectedAssignment.section}
            </p>

            <div className="space-y-2">
              {students.length === 0 ? (
                <p>No students found.</p>
              ) : (
                students.map((student) => (
                  <div key={student.id} className="bg-gray-100 p-2 rounded-lg">
                    <p className="text-gray-700">{student.name}</p>
                  </div>
                ))
              )}
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
