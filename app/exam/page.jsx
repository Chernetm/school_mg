"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function StudentExam() {

  const [examTitle, setExamTitle] = useState("");
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const fetchExam = async () => {
    try {
      const res = await fetch(`/api/student/exam?title=${examTitle}`);
      if (!res.ok) throw new Error("Exam not found");
      const data = await res.json();

      setExam(data.exam);
      setStudentId(data.studentID);
      setTimeLeft(calculateTimeLeft(data.startTime, data.endTime));
    } catch (error) {
      console.error("Error fetching exam:", error);
    }
  };

  useEffect(() => {
    if (!studentId) return;

    const newSocket = io("http://localhost:4000");

    newSocket.on("connect", () => {
      console.log("✅ Connected to WebSocket", studentId);
      newSocket.emit("studentOnline", { studentId });
    });

    newSocket.on("forceLogout", () => {
      alert("You have been logged out because your account is active on another device.");
      newSocket.disconnect();
    });

    const handleVisibilityChange = () => {
      if (document.hidden) {
        newSocket.emit("student_cheating", { studentId, message: "Tab switched" });
      }
    };

    const handleWindowBlur = () => {
      newSocket.emit("student_cheating", { studentId, message: "Window minimized" });
    };

    const handleWindowFocus = () => {
      newSocket.emit("student_cheating", { studentId, message: "Window refocused" });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      newSocket.disconnect();
    };
  }, [studentId]);

  const calculateTimeLeft = (start, end) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    return Math.max(0, Math.floor((endTime - startTime) / 1000));
  };

  useEffect(() => {
    if (timeLeft !== null) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (!exam) return alert("Exam not found!");

    try {
      const response = await fetch("/api/student/exam/submit-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: exam.id,
          answers: Object.entries(answers).map(([questionId, answer]) => ({
            questionId: Number(questionId),
            answer,
          })),
        }),
      });

      const data = await response.json();
      console.log("Exam submitted:", data);
      alert("Exam submitted successfully!");
    } catch (error) {
      console.error("Error submitting exam:", error);
      alert("Failed to submit exam.");
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-6 bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-screen-md">
        {!exam ? (
          <div className="bg-white shadow-md p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-700 text-center">Enter Exam Title</h2>
            <input
              type="text"
              className="w-full p-3 border rounded-lg text-gray-700"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
            />
            <button
              className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={fetchExam}
            >
              Fetch Exam
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-gray-700">{exam.title}</h2>
  
            <div className="text-xl font-semibold text-red-500 bg-white px-4 py-2 rounded-lg shadow text-center">
              Time Left: {timeLeft !== null ? formatTime(timeLeft) : "00:00"}
            </div>
  
            {exam.questions[currentIndex] && (
              <div className="bg-white shadow-lg p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Question {currentIndex + 1}/{exam.questions.length}
                </h3>
                <p className="text-lg font-medium text-gray-700 mb-4">
                  {exam.questions[currentIndex].content}
                </p>
  
                <div className="space-y-3 text-gray-700">
                  {["A", "B", "C", "D"].map((option) => (
                    <label
                      key={option}
                      className="flex items-center space-x-3 bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition cursor-pointer"
                    >
                      <input
                        type="radio"
                        className="h-5 w-5 text-blue-600"
                        checked={answers[exam.questions[currentIndex].id] === option}
                        onChange={() => handleAnswer(exam.questions[currentIndex].id, option)}
                      />
                      <span className="text-lg">{exam.questions[currentIndex][`option${option}`]}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
  
            <div className="flex justify-between gap-4">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                className={`flex-1 py-2 rounded-lg font-semibold transition ${
                  currentIndex === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Previous
              </button>
  
              <button
                disabled={currentIndex >= exam.questions.length - 1}
                onClick={() => setCurrentIndex((i) => Math.min(exam.questions.length - 1, i + 1))}
                className={`flex-1 py-2 rounded-lg font-semibold transition ${
                  currentIndex >= exam.questions.length - 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Next
              </button>
            </div>
  
            {currentIndex === exam.questions.length - 1 && (
              <button
                onClick={handleSubmit}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-green-700 transition"
              >
                Submit Exam
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}