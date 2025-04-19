
"use client";
import { useEffect, useState } from "react";

export default function StaffAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [mode, setMode] = useState("attendance");
  const [semester, setSemester] = useState("1");
  const [attendance, setAttendance] = useState({});
  const [results, setResults] = useState({});
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetch("/api/teacher/assigned-section")
      .then((res) => res.json())
      .then((data) => setAssignments(data.assignments || []));
  }, []);

  const fetchStudents = async (grade, section) => {
    try {
      const response = await fetch(`/api/teacher/student?grade=${grade}&section=${section}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch students");
      setStudents(data.students);
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
    setAttendance({});
    setResults({});
    setFeedback(null);
  };

  const setStudentAttendance = (id, status) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: prev[id] === status ? undefined : status,
    }));
  };

  const submitAttendance = async () => {
    try {
      const res = await fetch("/api/teacher/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attendance }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit attendance");
      }

      setFeedback({ type: "success", message: "Attendance submitted successfully!" });
    } catch (error) {
      setFeedback({ type: "error", message: "Failed to submit attendance: " + error.message });
    }
  };

  const handleResultChange = (studentID, value) => {
    setResults((prev) => ({
      ...prev,
      [studentID]: value,
    }));
  };

  const handleUploadAll = async () => {
    if (!selectedAssignment) return;

    const payload = Object.entries(results).map(([studentID, result]) => ({
      studentID: studentID,
      result: Number(result),
      semester:Number(semester),
      subject: selectedAssignment.subject,
      grade: Number(selectedAssignment.grade),
      section: selectedAssignment.section,
    }));

    try {
      const res = await fetch("/api/teacher/resultUpload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results: payload }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload results");
      }

      setFeedback({ type: "success", message: "Results uploaded successfully!" });
    } catch (error) {
      setFeedback({ type: "error", message: "Failed to upload results: " + error.message });
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Staff Assignments</h1>
      <div className="flex flex-wrap gap-4 text-gray-600">
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              {selectedAssignment.subject} - {mode === "attendance" ? "Attendance" : "Result Upload"}
            </h2>
            <p className="mb-2 text-gray-700">
              <strong>Grade:</strong> {selectedAssignment.grade}
            </p>
            <p className="mb-4 text-gray-700">
              <strong>Section:</strong> {selectedAssignment.section}
            </p>

            <div className="flex gap-4 mb-4">
              <button
                className={`p-2 w-1/2 rounded ${mode === "attendance" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                onClick={() => setMode("attendance")}
              >
                Attendance
              </button>
              <button
                className={`p-2 w-1/2 rounded ${mode === "result" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                onClick={() => setMode("result")}
              >
                Upload Result
              </button>
            </div>

            {mode === "result" && (
              <div className="mb-4">
                <label className="text-gray-700 font-semibold">Select Semester:</label>
                <select
                  className="block w-full p-2 mt-1 border rounded"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                >
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                </select>
              </div>
            )}

            {feedback && (
              <div
                className={`mb-4 p-3 rounded text-sm ${
                  feedback.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {feedback.message}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-gray-900">
                    <th className="border border-gray-300 px-4 py-2">Student ID</th>
                    <th className="border border-gray-300 px-4 py-2">Name</th>
                    {mode === "attendance" ? (
                      <>
                        <th className="border border-gray-300 px-4 py-2 text-center">Present</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">Absent</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">Late</th>
                      </>
                    ) : (
                      <>
                        <th className="border border-gray-300 px-4 py-2 text-center">Result</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={mode === "attendance" ? 5 : 3} className="text-center border border-gray-300 px-4 py-2 text-gray-600">
                        No students found.
                      </td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr key={student.studentID} className="text-gray-800 even:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">{student.studentID}</td>
                        <td className="border border-gray-300 px-4 py-2">{student.firstName} {student.lastName}</td>

                        {mode === "attendance" ? (
                          <>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              <button onClick={() => setStudentAttendance(student.studentID, "present")}
                                className={`p-2 rounded ${attendance[student.studentID] === "present" ? "bg-green-500 text-white" : "bg-gray-300"}`}>
                                ✔
                              </button>
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              <button onClick={() => setStudentAttendance(student.studentID, "absent")}
                                className={`p-2 rounded ${attendance[student.studentID] === "absent" ? "bg-red-500 text-white" : "bg-gray-300"}`}>
                                ❌
                              </button>
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              <button onClick={() => setStudentAttendance(student.studentID, "late")}
                                className={`p-2 rounded ${attendance[student.studentID] === "late" ? "bg-yellow-500 text-white" : "bg-gray-300"}`}>
                                ⏳
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="border border-gray-300 px-4 py-2">
                              <input
                                type="number"
                                className="w-full p-1 border rounded"
                                onChange={(e) => handleResultChange(student.studentID, e.target.value)}
                              />
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {mode === "attendance" && (
              <button onClick={submitAttendance} className="mt-4 w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600">Submit Attendance</button>
            )}

            {mode === "result" && (
              <button onClick={handleUploadAll} className="mt-4 w-full bg-green-500 text-white font-bold py-2 rounded-md hover:bg-green-600">Upload All Results</button>
            )}

            <button onClick={closeModal} className="mt-4 w-full bg-gray-500 text-white font-bold py-2 rounded-md hover:bg-gray-700">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

