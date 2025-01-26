"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Loader from "@/components/Loader";

function QuizResultPage({ params }) {
  const { quizId } = use(params); // Extract quizId from params
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (quizId) {
      fetchQuizData();
    }
  }, [quizId]);

  const fetchQuizData = async () => {
    try {
      const response = await axios.post(`/api/quiz`, {
        ge: "fetchQuiz",
        quizId,
      });
      setAttempts(response.data?.attempts || []); // Get attempts from quiz data
      setLoading(false);
    } catch (error) {
      console.error(error);
      setAttempts([]);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-8 min-h-screen" style={{ backgroundColor: "#242527" }}>
      <div className="max-w-3xl mx-auto rounded-lg shadow-lg p-6" style={{ backgroundColor: "#31363f" }}>
        <h1 className="text-2xl font-semibold text-white-800 mb-6">Quiz Results</h1>

        {attempts.length === 0 ? (
          <p className="text-white-600">No attempts found for this quiz.</p>
        ) : (
          attempts.map((attempt, index) => (
            <div key={index} className="p-4 border rounded-md mb-4" style={{ backgroundColor: "#242527" }}>
              <h3 className="text-white-700">
                <label className="text-green-500">Student ID:</label> {attempt.studentId}
              </h3>
              <p className="text-white-600">
                <label className="text-green-500">Score:</label> {attempt.score}
              </p>
              <p className="text-gray-400">
                Attempted At: {new Date(attempt.attemptedAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default QuizResultPage;

