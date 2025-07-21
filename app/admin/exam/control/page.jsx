"use client";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const CHEATING_TYPES = [
    "Tab Switched",
    "Window Minimized",
    "Window Refocused",
    "Multiple Login",
];

const StudentActivity = () => {
    const [cheatingLog, setCheatingLog] = useState({});
    const [onlineStudents, setOnlineStudents] = useState([]);
    const [studentDetails, setStudentDetails] = useState({});

    
    // const adminSchoolId = session.user.schoolId;
    // const filteredStudentIds = allStudentIds.filter(
    //   (id) => studentDetails[id]?.schoolId === adminSchoolId
    // );
    
    useEffect(() => {
        const socket = io("https://exam-server-p1p6.onrender.com", {
            transports: ["websocket"],
        });

        socket.on("connect", () => {
            console.log("✅ Connected to WebSocket");
        });

        socket.on("updateOnlineStudents", (students) => {
            setOnlineStudents(students);
            students.forEach(fetchStudentDetails);
        });

        socket.on("cheatingAlert", ({ studentId, message }) => {
            fetchStudentDetails(studentId);

            setCheatingLog((prev) => {
                const updated = { ...prev };
                if (!updated[studentId]) updated[studentId] = {};

                if (message.includes("Tab")) {
                    updated[studentId]["Tab Switched"] = (updated[studentId]["Tab Switched"] || 0) + 1;
                }
                if (message.includes("minimized")) {
                    updated[studentId]["Window Minimized"] = (updated[studentId]["Window Minimized"] || 0) + 1;
                }
                if (message.includes("refocused")) {
                    updated[studentId]["Window Refocused"] = (updated[studentId]["Window Refocused"] || 0) + 1;
                }

                return updated;
            });
        });

        socket.on("forceLogout", ({ studentId }) => {
            fetchStudentDetails(studentId);
            setCheatingLog((prev) => {
                const updated = { ...prev };
                if (!updated[studentId]) updated[studentId] = {};
                updated[studentId]["Multiple Login"] = (updated[studentId]["Multiple Login"] || 0) + 1;
                return updated;
            });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const fetchStudentDetails = async (studentId) => {
        if (studentDetails[studentId]) return;
        try {
            const res = await fetch(`/api/admin/student/${studentId}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            });

            if (!res.ok) throw new Error(`Student ${studentId} not found`);

            const data = await res.json();
            setStudentDetails((prev) => ({ ...prev, [studentId]: data }));
        } catch (err) {
            console.error(`❌ Failed to fetch student ${studentId}:`, err);
        }
    };

    const allStudentIds = Array.from(new Set([...Object.keys(cheatingLog), ...onlineStudents]));
    

    return (
        <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
            <div className="bg-white w-full max-w-7xl rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                    Student Monitoring Dashboard
                </h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-blue-400">
                                <th className="border px-6 py-3 whitespace-nowrap">ID</th>
                                <th className="border px-6 py-3 whitespace-nowrap">First Name</th>
                                <th className="border px-6 py-3 whitespace-nowrap">Last Name</th>
                                <th className="border px-6 py-3 whitespace-nowrap">Grade</th>
                                <th className="border px-6 py-3 whitespace-nowrap">Section</th>
                                <th className="border px-6 py-3 whitespace-nowrap">Status</th>
                                {CHEATING_TYPES.map((type) => (
                                    <th key={type} className="border px-4 py-2 text-sm">{type}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {allStudentIds.map((id) => {
                                const student = studentDetails[id] || {};
                                const cheating = cheatingLog[id] || {};
                                const isOnline = onlineStudents.includes(id);

                                return (
                                    <tr key={id} className="text-center hover:bg-gray-50">
                                        <td className="border px-4 text-gray-700 py-2">{id}</td>
                                        <td className="border px-4 text-gray-700 py-2">{student.firstName || "-"}</td>
                                        <td className="border px-4 text-gray-700 py-2">{student.lastName || "-"}</td>
                                        <td className="border px-4 text-gray-700 py-2">{student.grade || "-"}</td>
                                        <td className="border px-4 text-gray-700 py-2">{student.section || "-"}</td>
                                        <td className="border px-4  py-2 font-semibold">
                                            <span className={clsx(isOnline ? "text-green-600" : "text-red-600")}>
                                                {isOnline ? "Online" : "Offline"}
                                            </span>
                                        </td>
                                        {CHEATING_TYPES.map((type) => (
                                            <td key={type} className="border px-4 py-2">
                                                {cheating[type] ? (
                                                    <span className="font-bold text-red-600">{cheating[type]}</span>
                                                ) : (
                                                    <span className="text-gray-400">0</span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                            {allStudentIds.length === 0 && (
                                <tr>
                                    <td colSpan={10} className="text-center py-4 text-gray-500">
                                        No student activity yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentActivity;
