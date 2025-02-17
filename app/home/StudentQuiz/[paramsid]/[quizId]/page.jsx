"use client";

import { use,useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Loader from "../../../../../components/Loader";
import { useUser } from '@clerk/nextjs';

function AttemptQuizPage({ params }) {
  const { quizId } = use(params); // Extract quizId from the route params
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0); // Timer for the quiz
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  // Fetch quiz details
  const fetchQuiz = async () => {
    try {
      const response = await axios.post(`/api/quiz`, {
        ge: "fetchQuiz",
        quizId,
      });
      
      const quizData = response.data;
      setQuiz(quizData);
      setTimeLeft(quizData.duration * 60); // Convert duration (minutes) to seconds
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // Handle timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quiz && !submitted) {
      handleSubmit(); // Auto-submit when time is up
    }
  }, [timeLeft, quiz, submitted]);

  const handleChange = (questionIndex, answer) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitted(true);
      const correctAnswers = quiz.questions.map((q) => q.correctAnswer);
      let score = 0;
      // Calculate the score
      quiz.questions.forEach((q, index) => {
        if (answers[index] === correctAnswers[index]) {
          score += 1; // Increment score for each correct answer
        }
      });
      const p = user.id;
      const id = await axios.post('/api/user', { id: p });
      const fg = id.data._id;
      // Send attempt data to the server
      await axios.post(`/api/quiz`, {
        ge: "submitAttempt",
        quizId,
        studentId: fg, // Replace with actual student ID
        score,
      });

      alert(`Quiz submitted! Your score: ${score}/${quiz.questions.length}`);
      router.push(`/home/StudentQuiz/${quiz.courseId}`);
    } catch (error) {
      console.error(error);
      alert("Failed to submit quiz. Please try again.");
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!quiz) {
    return <div>No quiz found!</div>;
  }

  return (
    <div className="p-8 min-h-screen" style={{ backgroundColor: "#242527" }}>
      <div className="max-w-3xl mx-auto rounded-lg shadow-lg p-6" style={{ backgroundColor: "#31363f" }}>
        <h1 className="text-2xl font-semibold text-white-800 mb-6">{quiz.title}</h1>
        <p className="text-gray-400">Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}</p>

        {quiz.questions.map((question, index) => (
          <div key={index} className="p-4 border rounded-md mb-4" style={{ backgroundColor: "#242527" }}>
            <p className="text-white-700">{question.question}</p>
            {question.options.map((option, i) => (
              <div key={i}>
                <label className="text-white-600">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    onChange={() => handleChange(index, option)}
                    disabled={submitted}
                  />{" "}
                  {option}
                </label>
              </div>
            ))}
          </div>
        ))}

        {!submitted && (
          <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}

export default AttemptQuizPage;
