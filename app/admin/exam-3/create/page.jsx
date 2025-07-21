"use client";
import { useState } from "react";

export default function AddQuestions() {
  const [examTitle, setExamTitle] = useState("");
  const [examDescription, setExamDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [questions, setQuestions] = useState([]);
  const [content, setContent] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correct, setCorrect] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const examId = 1; // Replace with dynamic exam ID

  const handleAddOrUpdateQuestion = () => {
    if (!content || !optionA || !optionB || !optionC || !optionD || !correct) {
      alert("Please fill in all fields and select a correct answer.");
      return;
    }

    if (editingIndex !== null) {
      setQuestions((prevQuestions) =>
        prevQuestions.map((q, i) =>
          i === editingIndex ? { ...q, content, optionA, optionB, optionC, optionD, correct } : q
        )
      );
      setEditingIndex(null);
    } else {
      setQuestions((prevQuestions) => [
        ...prevQuestions,
        {
          id: prevQuestions.length,
          content,
          optionA,
          optionB,
          optionC,
          optionD,
          correct,
        },
      ]);
    }

    resetForm();
  };

  const handleEditQuestion = (index) => {
    const question = questions[index];

    setContent(question.content);
    setOptionA(question.optionA);
    setOptionB(question.optionB);
    setOptionC(question.optionC);
    setOptionD(question.optionD);
    setCorrect(question.correct);

    setEditingIndex(index);
  };

  const handleDeleteQuestion = (index) => {
    setQuestions((prevQuestions) => prevQuestions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!examTitle || !examDescription || !startTime || !endTime) {
      alert("Please fill in all exam details.");
      return;
    }

    if (questions.length === 0) {
      alert("Please add at least one question before submitting.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/exam/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          examId,
          examTitle,
          examDescription,
          startTime,
          endTime,
          questions,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add questions");
      }

      alert("Exam and questions added successfully!");
      setQuestions([]);
      setExamTitle("");
      setExamDescription("");
      setStartTime("");
      setEndTime("");
    } catch (error) {
      console.error("Error adding questions:", error);
      alert("Failed to add questions.");
    }

    setLoading(false);
  };

  const resetForm = () => {
    setContent("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setCorrect("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Create Exam</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Exam Title</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 text-gray-700 rounded-lg"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Exam Description</label>
          <textarea
            className="w-full p-2 border border-gray-300 text-gray-700 rounded-lg"
            value={examDescription}
            onChange={(e) => setExamDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Start Time</label>
          <input
            type="datetime-local"
            className="w-full p-2 border border-gray-300 text-gray-700 rounded-lg"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">End Time</label>
          <input
            type="datetime-local"
            className="w-full p-2 border border-gray-300 text-gray-700 rounded-lg"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Question</label>
          <textarea
            className="w-full p-2 border border-gray-300 text-gray-700 rounded-lg"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="space-y-3">
          <label className="block text-gray-700 font-medium mb-1">Options</label>
          {["A", "B", "C", "D"].map((label) => (
            <div key={label} className="flex items-center space-x-2">
              <input
                type="text"
                className="flex-1 p-2 border border-gray-300 text-gray-700 rounded-lg"
                placeholder={`Option ${label}`}
                value={eval(`option${label}`)}
                onChange={(e) => eval(`setOption${label}(e.target.value)`)}
                required
              />
              <input
                type="radio"
                name="correctOption"
                value={label}
                checked={correct === label}
                onChange={() => setCorrect(label)}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
          onClick={handleAddOrUpdateQuestion}
        >
          {editingIndex !== null ? "Update Question" : "Add Question"}
        </button>

        {questions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Questions Added ({questions.length})</h3>
            <ul className="space-y-3">
              {questions.map((q, index) => (
                <li key={index} className="p-3 bg-gray-100 text-gray-700 rounded-lg flex justify-between items-center">
                  <div>
                    <span>{index + 1}. {q.content}</span>
                    <ul className="list-disc ml-5 text-sm text-gray-700">
                      <li><strong>A:</strong> {q.optionA}</li>
                      <li><strong>B:</strong> {q.optionB}</li>
                      <li><strong>C:</strong> {q.optionC}</li>
                      <li><strong>D:</strong> {q.optionD}</li>
                    </ul>
                    <p className="text-sm font-semibold text-green-600">Correct Answer: {q.correct}</p>
                  </div>
                  <div className="space-x-2">
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600" onClick={() => handleEditQuestion(index)}>Edit</button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600" onClick={() => handleDeleteQuestion(index)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600" onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit Exam"}
        </button>
      </form>
    </div>
  );
}
