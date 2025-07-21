'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function StudentExam() {
  const { data: session, status } = useSession();
  const [examList, setExamList] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.id || !exam) return;

    const studentId = session.user.studentID;
    const socket = io('https://exam-server-p1p6.onrender.com', {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      socket.emit('studentOnline', { studentId });
    });

    const handleVisibilityChange = () => {
      if (document.hidden) {
        socket.emit('student_cheating', {
          studentId,
          message: 'Tab switched or minimized',
        });
      }
    };

    const handleWindowBlur = () => {
      socket.emit('student_cheating', {
        studentId,
        message: 'Window lost focus',
      });
    };

    const handleWindowFocus = () => {
      socket.emit('student_refocused', {
        studentId,
        message: 'Window refocused',
      });
    };

    const handleBeforeUnload = () => {
      socket.emit('studentOffline', { studentId });
      socket.emit('student_cheating', {
        studentId,
        message: 'Tab closed or page refreshed',
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    socket.on('forceLogout', () => {
      setErrorMessage('You have been logged out due to suspicious activity.');
      socket.disconnect();
      router.push('/login');
    });

    return () => {
      socket.emit('studentOffline', { studentId });
      socket.disconnect();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [status, session, exam, router]);

  const fetchExamList = async () => {
    try {
      const res = await fetch('/api/student/exam');
      if (!res.ok) throw new Error('Failed to fetch exams');
      const data = await res.json();
      setExamList(data.exams);
    } catch (error) {
      setErrorMessage('Could not load exams.');
    }
  };

  const fetchExam = async (title) => {
    setErrorMessage(null);
    try {
      const res = await fetch('/api/student/exam/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      const data = await res.json();

      if (!res.ok || !data.exam) {
        throw new Error(data.message || 'You have already submitted!, Take another exam.');
      }

      setExam(data.exam);
      setTimeLeft(data.exam.durationMinutes * 60);
    } catch (error) {
      setExam(null);
      setTimeLeft(null);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    fetchExamList();
  }, []);

  useEffect(() => {
    if (selectedTitle) fetchExam(selectedTitle);
  }, [selectedTitle]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit(); // Auto-submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (!exam) return;

    const fullAnswers = exam.questions.map((q) => ({
      questionId: q.id,
      answer: answers[q.id] ?? null,
    }));

    try {
      const response = await fetch('/api/student/exam/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: exam.id,
          answers: fullAnswers,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit');

      router.push('/student/exam/result');
    } catch (error) {
      setErrorMessage('You have already submitted this exam! Take another exam.');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const renderError = () =>
    errorMessage && (
      <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{errorMessage}</span>
        <button
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
          onClick={() => setErrorMessage('')}
        >
          <svg className="fill-current h-6 w-6 text-red-500" role="button" viewBox="0 0 20 20">
            <title>Close</title>
            <path d="M14.348 5.652a1 1 0 00-1.414 0L10 8.586 7.066 5.652A1 1 0 105.652 7.066L8.586 10l-2.934 2.934a1 1 0 101.414 1.414L10 11.414l2.934 2.934a1 1 0 001.414-1.414L11.414 10l2.934-2.934a1 1 0 000-1.414z" />
          </svg>
        </button>
      </div>
    );

  if (!selectedTitle) {
    return (
      <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-4">Select an Exam</h2>
        {renderError()}
        {examList.length === 0 ? (
          <p className="text-gray-600">No exam found.</p>
        ) : (
          <ul className="space-y-3 w-full max-w-md">
            {examList.map((exam) => (
              <li
                key={exam.id}
                onClick={() => setSelectedTitle(exam.title)}
                className="cursor-pointer p-4 bg-white text-black rounded-lg shadow hover:bg-blue-100"
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
        {renderError()}
        {!exam ? (
          <div className="bg-white shadow-md p-6 rounded-xl">
            <p className="text-gray-600 text-center">Loading exam...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-gray-700">{exam.title}</h2>
            <div className="text-xl font-semibold text-red-500 bg-white px-4 py-2 rounded-lg shadow text-center">
              Time Left: {formatTime(timeLeft)}
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
                  {['A', 'B', 'C', 'D'].map((option) => (
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
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Previous
              </button>

              <button
                disabled={currentIndex >= exam.questions.length - 1}
                onClick={() => setCurrentIndex((i) => Math.min(exam.questions.length - 1, i + 1))}
                className={`flex-1 py-2 rounded-lg font-semibold transition ${
                  currentIndex >= exam.questions.length - 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
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
