"use client";
import { use,useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";

function QuizCreationPage({ params }) {
  const { id } = use(params); // Extract courseId from route params
  const [quizTitle, setQuizTitle] = useState("");
  const [description, setDescription] = useState(""); // New field
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState(""); // New field
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({ question: "", options: ["", "", "", ""], correctAnswer: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) { setLoading(false);}// Set the courseId when the component mounts
  }, [id]);


  const addQuestion = () => {
    if (!currentQuestion.question || currentQuestion.options.some(opt => opt === "") || !currentQuestion.correctAnswer) {
      toast.error("Please fill out all fields for the question.");
      return;
    }
    setQuestions([...questions, currentQuestion]);
    setCurrentQuestion({ question: "", options: ["", "", "", ""], correctAnswer: "" });
    toast.success("Question added successfully!");
  };

  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, idx) => idx !== index);
    setQuestions(updatedQuestions);
    toast.info("Question removed.");
  };

  const handleSubmitQuiz = async () => {
    if (!quizTitle || !description || !startDate || !endDate || !duration || questions.length === 0) {
      toast.error("Please fill out all quiz details.");
      return;
    }

    try {
      const ge = "create";
      const response = await axios.post(`/api/quiz`, {
        courseId:id,
        title: quizTitle,
        description, // Add description
        startTime: startDate,
        endTime: endDate,
        duration, // Add duration
        questions,
        ge,
      });

      if (response.status === 200) {
        toast.success("Quiz created successfully!");
        setQuizTitle("");
        setDescription(""); // Clear description
        setStartDate("");
        setEndDate("");
        setDuration(""); // Clear duration
        setQuestions([]);
      } else {
        toast.error("Error creating quiz.");
      }
    } catch (error) {
      toast.error("Error creating quiz.");
      console.error(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-8 min-h-screen" style={{ backgroundColor: "#242527" }}>
      <div className="max-w-3xl mx-auto rounded-lg shadow-lg p-6" style={{ backgroundColor: "#31363f" }}>
        <h1 className="text-2xl font-semibold text-white-800 mb-6">Create Quiz</h1>

        {/* Quiz Details */}
        <div className="mb-4">
          <label className="block text-white-700 font-medium mb-2">Quiz Title:</label>
          <input
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            className="border text-black border-white-300 p-2 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white-700 font-medium mb-2">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border text-black border-white-300 p-2 rounded w-full"
            placeholder="Enter a brief description of the quiz"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white-700 font-medium mb-2">Start Date and Time:</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border text-black border-white-300 p-2 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white-700 font-medium mb-2">End Date and Time:</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border text-black border-white-300 p-2 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white-700 font-medium mb-2">Duration (in minutes):</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="border text-black border-white-300 p-2 rounded w-full"
            placeholder="Enter quiz duration"
          />
        </div>

        {/* Question Form */}
        <div className="mb-6">
          <label className="block text-white-700 font-medium mb-2">Add Question:</label>
          <textarea
            value={currentQuestion.question}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
            className="border text-black border-white-300 p-2 rounded w-full mb-4"
            placeholder="Enter the question"
          />
          <div className="grid grid-cols-2 gap-4">
            {currentQuestion.options.map((option, idx) => (
              <input
                key={idx}
                type="text"
                value={option}
                onChange={(e) => {
                  const updatedOptions = [...currentQuestion.options];
                  updatedOptions[idx] = e.target.value;
                  setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
                }}
                className="border text-black border-white-300 p-2 rounded w-full"
                placeholder={`Option ${idx + 1}`}
              />
            ))}
          </div>
          <input
            type="text"
            value={currentQuestion.correctAnswer}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
            className="border text-black border-white-300 p-2 rounded w-full mt-4"
            placeholder="Correct Answer"
          />
          <button
            onClick={addQuestion}
            className="bg-green-500 text-white py-2 px-4 rounded mt-4 hover:bg-green-600 transition"
          >
            Add Question
          </button>
        </div>

        {/* Question List */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white-800 mb-4">Questions Added:</h2>
          {questions.length === 0 ? (
            <p className="text-white-600">No questions added yet.</p>
          ) : (
            questions.map((q, idx) => (
              <div
                key={idx}
                className="p-4 border rounded-md mb-4"
                style={{ backgroundColor: "#242527" }}
              >
                <h3 className="text-white-700">{q.question}</h3>
                <ul className="list-disc ml-6 text-white-600">
                  {q.options.map((opt, i) => (
                    <li key={i}>{opt}</li>
                  ))}
                </ul>
                <p className="text-green-500">Correct Answer: {q.correctAnswer}</p>
                <button
                  onClick={() => removeQuestion(idx)}
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition mt-2"
                >
                  Remove Question
                </button>
              </div>
            ))
          )}
        </div>

        {/* Submit Quiz */}
        <button
          onClick={handleSubmitQuiz}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
}

export default QuizCreationPage;
