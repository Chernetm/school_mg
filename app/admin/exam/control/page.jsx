"use client"
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const StudentActivity = ({ studentId }) => {
  const [status, setStatus] = useState("Offline");
  const [activityLog, setActivityLog] = useState({});
  const [onlineStudents, setOnlineStudents] = useState([]);
  const [loginAttempts, setLoginAttempts] = useState({});

  useEffect(() => {
    const socket = io("https://exam-server-p1p6.onrender.com", {
      transports: ["websocket"], // 🔐 Forces WebSocket (avoids long polling)
      withCredentials: true,     // ✅ Sends cookies if needed (optional based on auth)
    });
    

    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket");
      socket.emit("studentOnline", { studentId });
      setStatus("Online");
    });

    socket.on("updateOnlineStudents", (students) => {
      setOnlineStudents(students);
    });

    socket.on("cheatingAlert", ({ studentId, message }) => {
      handleActivityLog(`Student ${studentId} is cheating! Reason: ${message}`);
    });

    socket.on("multipleLoginAlert", ({ studentId, message, count }) => {
      handleMultipleLoginAlert(studentId, message, count);
    });

    socket.on("forceLogout", () => {
      alert("You have been logged out because your account is active on another device.");
      socket.disconnect();
      setStatus("Offline");
    });

    const handleVisibilityChange = () => {
      if (document.hidden) {
        socket.emit("student_cheating", { studentId, message: "Tab switched" });
      }
    };

    const handleWindowBlur = () => {
      socket.emit("student_cheating", { studentId, message: "Window minimized" });
    };

    const handleWindowFocus = () => {
      socket.emit("student_cheating", { studentId, message: "Window refocused" });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      socket.disconnect();
    };
  }, [studentId]);

  const handleActivityLog = (message) => {
    setActivityLog((prevLog) => {
      const newLog = { ...prevLog };
      newLog[message] = (newLog[message] || 0) + 1;
      return newLog;
    });
  };

  const handleMultipleLoginAlert = (studentId, message, count) => {
    setLoginAttempts((prevAttempts) => {
      const newAttempts = { ...prevAttempts };
      newAttempts[studentId] = { message, count };
      return newAttempts;
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-700 to-blue-500 text-white p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-3xl text-gray-900">
        <h2 className="text-2xl font-bold text-center mb-4">Student Activity</h2>
        <p className={`text-lg font-semibold text-center ${status === "Online" ? "text-green-500" : "text-red-500"}`}>
          Status: {status}
        </p>
        <h3 className="text-xl font-semibold mt-4">Online Students:</h3>
        <ul className="list-disc pl-6">
          {onlineStudents.length > 0 ? (
            onlineStudents.map((student) => <li key={student}>{student}</li>)
          ) : (
            <li className="text-gray-500">No students online</li>
          )}
        </ul>

        <h3 className="text-xl font-semibold mt-4">Activity Log:</h3>
        <ul className="list-disc pl-6">
          {Object.entries(activityLog).map(([message, count], index) => (
            <li key={index} className="text-red-600 font-semibold">
              {message} (Occurred: {count} times)
            </li>
          ))}
        </ul>

        <h3 className="text-xl font-semibold mt-4">Multiple Login Alerts:</h3>
        <ul className="list-disc pl-6">
          {Object.entries(loginAttempts).map(([studentId, { message, count }]) => (
            <li key={studentId} className="text-yellow-500 font-semibold">
              {message} (Student {studentId}) - Occurred {count} times
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentActivity;
