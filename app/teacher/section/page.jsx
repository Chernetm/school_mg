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
      if (!res.ok) throw new Error(data.error || "Failed to submit attendance");

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
      studentID,
      result: Number(result),
      semester: Number(semester),
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
      if (!res.ok) throw new Error(data.error || "Failed to upload results");

      setFeedback({ type: "success", message: "Results uploaded successfully!" });
    } catch (error) {
      setFeedback({ type: "error", message: "Failed to upload results: " + error.message });
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen text-sm sm:text-base">
      {/* 🔷 Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* ... (unchanged announcement and section cards) */}
      </div>
  
      {/* 🔶 Assignments List */}
      <h1 id="assignment-section" className="text-2xl font-bold mb-6 text-gray-800">Section List</h1>
      <div className="flex flex-col gap-6">
        {assignments.length > 0 ? (
          assignments.map((assignment) => (
            <div
              key={`${assignment.grade}-${assignment.section}-${assignment.subject}`}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg"
            >
              <div
                className="cursor-pointer"
                onClick={() => {
                  handleCardClick(assignment);
                }}
              >
                <h2 className="text-lg font-semibold text-gray-800">{assignment.subject}</h2>
                <p className="text-gray-600">Grade: {assignment.grade} | Section: {assignment.section}</p>
              </div>
  
              {selectedAssignment &&
                selectedAssignment.grade === assignment.grade &&
                selectedAssignment.section === assignment.section &&
                selectedAssignment.subject === assignment.subject && (
                  <div className="mt-4">
                    {/* Mode toggle */}
                    <div className="flex gap-2 mb-4">
                      <button
                        className={`flex-1 p-2 rounded ${mode === "attendance" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        onClick={() => setMode("attendance")}
                      >
                        Attendance
                      </button>
                      <button
                        className={`flex-1 p-2 rounded ${mode === "result" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        onClick={() => setMode("result")}
                      >
                        Upload Result
                      </button>
                    </div>
  
                    {mode === "result" && (
                      <div className="mb-4">
                        <label className="font-semibold text-gray-700">Semester:</label>
                        <select
                          className="block w-full p-2 border rounded mt-1"
                          value={semester}
                          onChange={(e) => setSemester(e.target.value)}
                        >
                          <option value="1">Semester 1</option>
                          <option value="2">Semester 2</option>
                        </select>
                      </div>
                    )}
  
                    {feedback && (
                      <div className={`mb-4 p-3 rounded text-sm ${
                        feedback.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {feedback.message}
                      </div>
                    )}
  
                    <div className="overflow-x-auto">
                      <table className="w-full border border-gray-300 text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-gray-200 text-gray-900">
                            <th className="border px-2 py-1">ID</th>
                            <th className="border px-2 py-1">Name</th>
                            {mode === "attendance" ? (
                              <>
                                <th className="border px-2 py-1 text-center">✔</th>
                                <th className="border px-2 py-1 text-center">❌</th>
                                <th className="border px-2 py-1 text-center">⏳</th>
                              </>
                            ) : (
                              <th className="border px-2 py-1 text-center">Result</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {students.length === 0 ? (
                            <tr>
                              <td colSpan={mode === "attendance" ? 5 : 3} className="text-center p-2 text-gray-600">
                                No students found.
                              </td>
                            </tr>
                          ) : (
                            students.map((student) => (
                              <tr key={student.studentID} className="even:bg-gray-50 text-gray-800">
                                <td className="border px-2 py-1">{student.studentID}</td>
                                <td className="border px-2 py-1">{student.firstName} {student.lastName}</td>
                                {mode === "attendance" ? (
                                  <>
                                    <td className="border px-2 py-1 text-center">
                                      <button onClick={() => setStudentAttendance(student.studentID, "present")}
                                        className={`p-1 rounded ${attendance[student.studentID] === "present" ? "bg-green-500 text-white" : "bg-gray-300"}`}>
                                        ✔
                                      </button>
                                    </td>
                                    <td className="border px-2 py-1 text-center">
                                      <button onClick={() => setStudentAttendance(student.studentID, "absent")}
                                        className={`p-1 rounded ${attendance[student.studentID] === "absent" ? "bg-red-500 text-white" : "bg-gray-300"}`}>
                                        ❌
                                      </button>
                                    </td>
                                    <td className="border px-2 py-1 text-center">
                                      <button onClick={() => setStudentAttendance(student.studentID, "late")}
                                        className={`p-1 rounded ${attendance[student.studentID] === "late" ? "bg-yellow-500 text-white" : "bg-gray-300"}`}>
                                        ⏳
                                      </button>
                                    </td>
                                  </>
                                ) : (
                                  <td className="border px-2 py-1">
                                    <input
                                      type="number"
                                      className="w-full p-1 border rounded text-xs sm:text-sm"
                                      onChange={(e) => handleResultChange(student.studentID, e.target.value)}
                                    />
                                  </td>
                                )}
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
  
                    {mode === "attendance" ? (
                      <button onClick={submitAttendance} className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Submit Attendance</button>
                    ) : (
                      <button onClick={handleUploadAll} className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">Upload All Results</button>
                    )}
                  </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600">No assignments available</p>
        )}
      </div>
    </div>
  );
  
}