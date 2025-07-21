'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
//import { io } from 'socket.io-client';

export default function StudentExercise() {
  const [examList, setExamList] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [exam, setExam] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch list of MODEL exams
  const fetchExamList = async () => {
    try {
      const res = await fetch('/api/student/exam/model');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to fetch exams');
      }
      const data = await res.json();
      setExamList(data.exams);
      setStudentId(data.studentId);
    } catch (error) {
      console.error('Error fetching exam list:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch selected exam's questions
  const fetchExam = async (title) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/student/exam/model/question?title=${encodeURIComponent(title)}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Exam not found');
      }
      const data = await res.json();
      setExam(data.exam);
      setTimeLeft(data.exam.durationMinutes * 60); // Convert minutes to seconds
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setShowResult(false);
    } catch (error) {
      console.error('Error fetching exam:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamList();
  }, []);

  useEffect(() => {
    if (selectedTitle) {
      fetchExam(selectedTitle);
    }
  }, [selectedTitle]);

  // WebSocket for cheating detection
//   useEffect(() => {
//     if (!studentId || !exam) return;

//     const newSocket = io('https://exam-server-p1p6.onrender.com', {
//       transports: ['websocket'],
//     });
//     newSocket.on('connect', () => {
//       console.log('✅ Connected to WebSocket', studentId);
//       newSocket.emit('studentOnline', { studentId });
//     });

//     newSocket.on('forceLogout', () => {
//       alert('You have been logged out because your account is active on another device.');
//       newSocket.disconnect();
//       router.push('/login');
//     });

//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         newSocket.emit('student_cheating', { studentId, message: 'Tab switched' });
//       }
//     };

//     const handleWindowBlur = () => {
//       newSocket.emit('student_cheating', { studentId, message: 'Window minimized' });
//     };

//     const handleWindowFocus = () => {
//       newSocket.emit('student_cheating', { studentId, message: 'Window refocused' });
//     };

//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     window.addEventListener('blur', handleWindowBlur);
//     window.addEventListener('focus', handleWindowFocus);

//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//       window.removeEventListener('blur', handleWindowBlur);
//       window.removeEventListener('focus', handleWindowFocus);
//       newSocket.disconnect();
//     };
//   }, [studentId, exam, router]);

  // Timer logic (informational, no auto-submit)
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || !exam) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, exam]);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < exam.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setSelectedTitle(null); // Return to exam list
      setExam(null);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading && !selectedTitle) {
    return (
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 text-center">Loading exams...</p>
      </div>
    );
  }

  if (error && !selectedTitle) {
    return (
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <p className="text-red-600 text-center">Error: {error}</p>
      </div>
    );
  }

  if (!selectedTitle) {
    return (
      <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Select a Model Exam</h2>
        {examList.length === 0 ? (
          <p className="text-gray-600">No model exams available.</p>
        ) : (
          <ul className="space-y-3 w-full max-w-md">
            {examList.map((exam) => (
              <li
                key={exam.id}
                onClick={() => setSelectedTitle(exam.title)}
                className="cursor-pointer p-4 bg-gray-200 text-black rounded-lg shadow hover:bg-blue-100 transition"
              >
                {exam.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-4 md:p-6 bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-screen-md">
        {loading ? (
          <div className="bg-white shadow-md p-6 rounded-xl">
            <p className="text-gray-600 text-center">Loading exam...</p>
          </div>
        ) : error ? (
          <div className="bg-white shadow-md p-6 rounded-xl">
            <p className="text-red-600 text-center">Error: {error}</p>
          </div>
        ) : !exam ? (
          <div className="bg-white shadow-md p-6 rounded-xl">
            <p className="text-gray-600 text-center">Exam not found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-gray-700">{exam.title}</h2>

            <div className="text-xl font-semibold text-red-500 bg-white px-4 py-2 rounded-lg shadow text-center">
              Time Left: {timeLeft !== null ? formatTime(timeLeft) : '00:00'}
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
                  {['A', 'B', 'C', 'D'].map((option) => {
                    const isCorrect = option === exam.questions[currentIndex].correct;
                    const isSelected = option === selectedAnswer;
                    let bgColor = 'bg-gray-100';
                    let textColor = 'text-gray-700';

                    if (showResult) {
                      if (isCorrect) {
                        bgColor = 'bg-green-500';
                        textColor = 'text-white';
                      } else if (isSelected && !isCorrect) {
                        bgColor = 'bg-red-500';
                        textColor = 'text-white';
                      }
                    }

                    return (
                      <label
                        key={option}
                        className={`flex items-center space-x-3 p-3 rounded-lg ${bgColor} ${textColor} hover:bg-gray-200 transition cursor-pointer ${
                          showResult ? 'pointer-events-none' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          className="h-5 w-5 text-blue-600"
                          checked={isSelected}
                          onChange={() => handleAnswer(option)}
                          disabled={showResult}
                        />
                        <span className="text-lg">{exam.questions[currentIndex][`option${option}`]}</span>
                      </label>
                    );
                  })}
                </div>

                {showResult && (
                  <div className="mt-4">
                    <p
                      className={`text-lg ${
                        selectedAnswer === exam.questions[currentIndex].correct
                          ? 'text-green-700'
                          : 'text-red-700'
                      }`}
                    >
                      Your Answer: {selectedAnswer} (
                      {selectedAnswer === exam.questions[currentIndex].correct
                        ? '✅ Correct'
                        : '❌ Incorrect'}
                      )
                    </p>
                    <p className="text-lg text-gray-700">
                      Correct Answer: {exam.questions[currentIndex].correct}
                    </p>
                  </div>
                )}
              </div>
            )}

            {showResult && (
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition"
                >
                  {currentIndex < exam.questions.length - 1 ? 'Next Question' : 'Finish'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}