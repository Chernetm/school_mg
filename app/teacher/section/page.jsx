// "use client";
// import Spinner from "@/components/Loading/Spinner/page";
// import { useEffect, useState } from "react";

// export default function StaffAssignments() {
//   const [assignments, setAssignments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [students, setStudents] = useState([]);
//   const [mode, setMode] = useState("attendance");
//   const [semester, setSemester] = useState("1");
//   const [attendance, setAttendance] = useState({});
//   const [results, setResults] = useState({});
//   const [feedback, setFeedback] = useState(null);
//   const [expandedSectionKey, setExpandedSectionKey] = useState(null);
//   const [activeAssignment, setActiveAssignment] = useState(null);

//   useEffect(() => {
//     const fetchAssignments = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch("/api/teacher/assigned-section");
//         const data = await res.json();
//         setAssignments(data.assignments || []);
//       } catch (err) {
//         console.error("Error fetching assignments:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAssignments();
//   }, []);

//   const getAssignmentKey = (assignment) =>
//     `${assignment.grade}-${assignment.section}-${assignment.subject}`;

//   const fetchStudents = async (grade, section) => {
//     setLoading(true);
//     try {
//       const response = await fetch(`/api/teacher/student?grade=${grade}&section=${section}`);
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.error || "Failed to fetch students");
//       setStudents(data.students);
//     } catch (error) {
//       console.error("Error fetching students:", error.message);
//       setStudents([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ⬇ ADD THIS: Spinner display
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <Spinner />
//       </div>
//     );
//   }

//   // ⬇ Continue your return (...)


//   const handleCardClick = (assignment) => {
//     const key = getAssignmentKey(assignment);

//     if (expandedSectionKey === key) {
//       setExpandedSectionKey(null);
//       setStudents([]);
//       setActiveAssignment(null);
//       setFeedback(null);
//       return;
//     }

//     setActiveAssignment(assignment);
//     setExpandedSectionKey(key);
//     fetchStudents(assignment.grade, assignment.section);
//     setAttendance({});
//     setResults({});
//     setFeedback(null);
//   };

//   const setStudentAttendance = (id, status) => {
//     setAttendance((prev) => ({
//       ...prev,
//       [id]: prev[id] === status ? undefined : status,
//     }));
//   };
//  const submitAttendance = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/teacher/attendance", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ attendance }),
//       });
  
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to submit attendance");
  
//       setFeedback({ type: "success", message: "Attendance submitted successfully!" });
//     } catch (error) {
//       setFeedback({ type: "error", message: "Failed to submit attendance: " + error.message });
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const handleResultChange = (studentID, value) => {
//     setResults((prev) => ({
//       ...prev,
//       [studentID]: value,
//     }));
//   };

//   const handleUploadAll = async () => {
//     if (!activeAssignment) return;
  
//     const payload = Object.entries(results).map(([studentID, result]) => ({
//       studentID,
//       result: Number(result),
//       semester: Number(semester),
//       subject: activeAssignment.subject,
//       grade: Number(activeAssignment.grade),
//       section: activeAssignment.section,
//     }));
  
//     setLoading(true);
//     try {
//       const res = await fetch("/api/teacher/resultUpload", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ results: payload }),
//       });
  
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to upload results");
  
//       setFeedback({ type: "success", message: "Results uploaded successfully!" });
//     } catch (error) {
//       setFeedback({ type: "error", message: "Failed to upload results: " + error.message });
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   return (
//     <div className="p-4 sm:p-6 bg-gray-100 min-h-screen text-sm sm:text-base">
//       <h1 className="text-2xl font-bold mb-6 text-gray-800">Section List</h1>

//       <div className="flex flex-col gap-6">
//         {assignments.length > 0 ? (
//           assignments.map((assignment) => {
//             const key = getAssignmentKey(assignment);
//             const isExpanded = expandedSectionKey === key;

//             return (
//               <div key={key} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all">
//                 <div className="cursor-pointer" onClick={() => handleCardClick(assignment)}>
//                   <h2 className="text-lg font-semibold text-gray-800">{assignment.subject}</h2>
//                   <p className="text-gray-600">
//                     Grade: {assignment.grade} | Section: {assignment.section}
//                   </p>
//                 </div>

//                 {isExpanded && (
//                   <div className="mt-4">
//                     <div className="flex justify-end">
//                       <button
//                         onClick={() => handleCardClick(assignment)}
//                         className="text-sm text-red-500 hover:underline mb-2"
//                       >
//                         Close ✖
//                       </button>
//                     </div>

//                     <div className="flex gap-2 mb-4">
//                       <button
//                         className={`flex-1 p-2 rounded ${mode === "attendance" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
//                         onClick={() => setMode("attendance")}
//                       >
//                         Attendance
//                       </button>
//                       <button
//                         className={`flex-1 p-2 rounded ${mode === "result" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
//                         onClick={() => setMode("result")}
//                       >
//                         Upload Result
//                       </button>
//                     </div>

//                     {mode === "result" && (
//                       <div className="mb-4">
//                         <label className="font-semibold text-gray-700">Semester:</label>
//                         <select
//                           className="block w-full p-2 border rounded mt-1"
//                           value={semester}
//                           onChange={(e) => setSemester(e.target.value)}
//                         >
//                           <option value="1">Semester 1</option>
//                           <option value="2">Semester 2</option>
//                         </select>
//                       </div>
//                     )}

//                     {feedback && (
//                       <div className={`mb-4 p-3 rounded text-sm ${feedback.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
//                         {feedback.message}
//                       </div>
//                     )}

//                     <div className="overflow-x-auto">
//                       <table className="w-full border border-gray-300 text-xs sm:text-sm">
//                         <thead>
//                           <tr className="bg-gray-200 text-gray-900">
//                             <th className="border px-2 py-1">ID</th>
//                             <th className="border px-2 py-1">Name</th>
//                             {mode === "attendance" ? (
//                               <>
//                                 <th className="border px-2 py-1 text-center">✔</th>
//                                 <th className="border px-2 py-1 text-center">❌</th>
//                                 <th className="border px-2 py-1 text-center">⏳</th>
//                               </>
//                             ) : (
//                               <th className="border px-2 py-1 text-center">Result</th>
//                             )}
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {students.length === 0 ? (
//                             <tr>
//                               <td colSpan={mode === "attendance" ? 5 : 3} className="text-center p-2 text-gray-600">
//                                 No students found.
//                               </td>
//                             </tr>
//                           ) : (
//                             students.map((student) => (
//                               <tr key={student.studentID} className="even:bg-gray-50 text-gray-800">
//                                 <td className="border px-2 py-1">{student.studentID}</td>
//                                 <td className="border px-2 py-1">{student.firstName} {student.middleName}</td>
//                                 {mode === "attendance" ? (
//                                   <>
//                                     <td className="border px-2 py-1 text-center">
//                                       <button
//                                         onClick={() => setStudentAttendance(student.studentID, "present")}
//                                         className={`p-1 rounded ${attendance[student.studentID] === "present" ? "bg-green-500 text-white" : "bg-gray-300"}`}
//                                       >
//                                         ✔
//                                       </button>
//                                     </td>
//                                     <td className="border px-2 py-1 text-center">
//                                       <button
//                                         onClick={() => setStudentAttendance(student.studentID, "absent")}
//                                         className={`p-1 rounded ${attendance[student.studentID] === "absent" ? "bg-red-500 text-white" : "bg-gray-300"}`}
//                                       >
//                                         ❌
//                                       </button>
//                                     </td>
//                                     <td className="border px-2 py-1 text-center">
//                                       <button
//                                         onClick={() => setStudentAttendance(student.studentID, "late")}
//                                         className={`p-1 rounded ${attendance[student.studentID] === "late" ? "bg-yellow-500 text-white" : "bg-gray-300"}`}
//                                       >
//                                         ⏳
//                                       </button>
//                                     </td>
//                                   </>
//                                 ) : (
//                                   <td className="border px-2 py-1">
//                                     <input
//                                       type="number"
//                                       className="w-full p-1 border rounded text-xs sm:text-sm"
//                                       onChange={(e) => handleResultChange(student.studentID, e.target.value)}
//                                     />
//                                   </td>
//                                 )}
//                               </tr>
//                             ))
//                           )}
//                         </tbody>
//                       </table>
//                     </div>

//                     {mode === "attendance" ? (
//                       <button
//                         onClick={submitAttendance}
//                         className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
//                       >
//                         Submit Attendance
//                       </button>
//                     ) : (
//                       <button
//                         onClick={handleUploadAll}
//                         className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
//                       >
//                         Upload All Results
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </div>
//             );
//           })
//         ) : (
//           <p className="text-gray-600">No assignments available</p>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";
import Spinner from "@/components/Loading/Spinner/page";
import { useEffect, useState } from "react";

export default function StaffAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [mode, setMode] = useState("attendance");
  const [semester, setSemester] = useState("1");
  const [attendance, setAttendance] = useState({});
  const [results, setResults] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [expandedSectionKey, setExpandedSectionKey] = useState(null);
  const [activeAssignment, setActiveAssignment] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/teacher/assigned-section");
        const data = await res.json();
        setAssignments(data.assignments || []);
      } catch (err) {
        console.error("Error fetching assignments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const getAssignmentKey = (assignment) =>
    `${assignment.grade}-${assignment.section}-${assignment.subject}`;

  const fetchStudents = async (grade, section) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/teacher/result?grade=${grade}&section=${section}&semester=${semester}`
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch students");
      setStudents(data.students);
    } catch (error) {
      console.error("Error fetching students:", error.message);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (assignment) => {
    const key = getAssignmentKey(assignment);
    if (expandedSectionKey === key) {
      setExpandedSectionKey(null);
      setStudents([]);
      setActiveAssignment(null);
      setFeedback(null);
      return;
    }
    setActiveAssignment(assignment);
    setExpandedSectionKey(key);
    fetchStudents(assignment.grade, assignment.section);
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
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleResultChange = (studentID, value) => {
    setResults((prev) => ({
      ...prev,
      [studentID]: value,
    }));
  };

  const handleUploadAll = async () => {
    if (!activeAssignment) return;
    const payload = Object.entries(results).map(([studentID, result]) => ({
      studentID,
      result: Number(result),
      semester: Number(semester),
      subject: activeAssignment.subject,
      grade: Number(activeAssignment.grade),
      section: activeAssignment.section,
    }));

    setLoading(true);
    try {
      const res = await fetch("/api/teacher/resultUpload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results: payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload results");
      setFeedback({ type: "success", message: "Results uploaded successfully!" });
      fetchStudents(activeAssignment.grade, activeAssignment.section); // refresh to show latest
    } catch (error) {
      setFeedback({ type: "error", message: "Failed to upload results: " + error.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen text-sm sm:text-base">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Section List</h1>

      <div className="flex flex-col gap-6">
        {assignments.length > 0 ? (
          assignments.map((assignment) => {
            const key = getAssignmentKey(assignment);
            const isExpanded = expandedSectionKey === key;

            return (
              <div key={key} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all">
                <div className="cursor-pointer" onClick={() => handleCardClick(assignment)}>
                  <h2 className="text-lg font-semibold text-gray-800">{assignment.subject}</h2>
                  <p className="text-gray-600">
                    Grade: {assignment.grade} | Section: {assignment.section}
                  </p>
                </div>

                {isExpanded && (
                  <div className="mt-4">
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleCardClick(assignment)}
                        className="text-sm text-red-500 hover:underline mb-2"
                      >
                        Close ✖
                      </button>
                    </div>

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
                      <div className={`mb-4 p-3 rounded text-sm ${feedback.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
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
                              <>
                                <th className="border px-2 py-1 text-center">Latest Result</th>
                                <th className="border px-2 py-1 text-center">New Result</th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {students.length === 0 ? (
                            <tr>
                              <td colSpan={mode === "attendance" ? 5 : 4} className="text-center p-2 text-gray-600">
                                No students found.
                              </td>
                            </tr>
                          ) : (
                            students.map((student) => (
                              <tr key={student.studentID} className="even:bg-gray-50 text-gray-800">
                                <td className="border px-2 py-1">{student.studentID}</td>
                                <td className="border px-2 py-1">{student.firstName} {student.middleName}</td>
                                {mode === "attendance" ? (
                                  <>
                                    <td className="border px-2 py-1 text-center">
                                      <button
                                        onClick={() => setStudentAttendance(student.studentID, "present")}
                                        className={`p-1 rounded ${attendance[student.studentID] === "present" ? "bg-green-500 text-white" : "bg-gray-300"}`}
                                      >
                                        ✔
                                      </button>
                                    </td>
                                    <td className="border px-2 py-1 text-center">
                                      <button
                                        onClick={() => setStudentAttendance(student.studentID, "absent")}
                                        className={`p-1 rounded ${attendance[student.studentID] === "absent" ? "bg-red-500 text-white" : "bg-gray-300"}`}
                                      >
                                        ❌
                                      </button>
                                    </td>
                                    <td className="border px-2 py-1 text-center">
                                      <button
                                        onClick={() => setStudentAttendance(student.studentID, "late")}
                                        className={`p-1 rounded ${attendance[student.studentID] === "late" ? "bg-yellow-500 text-white" : "bg-gray-300"}`}
                                      >
                                        ⏳
                                      </button>
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td className="border px-2 py-1 text-center">
  {student.results?.[0]?.score ?? "-"}
</td>

                                    <td className="border px-2 py-1 text-center">
                                      <input
                                        type="number"
                                        className="w-full p-1 border rounded text-xs sm:text-sm"
                                        value={results[student.studentID] ?? ""}
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

                    {mode === "attendance" ? (
                      <button
                        onClick={submitAttendance}
                        className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                      >
                        Submit Attendance
                      </button>
                    ) : (
                      <button
                        onClick={handleUploadAll}
                        className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                      >
                        Upload All Results
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-600">No assignments available</p>
        )}
      </div>
    </div>
  );
}
