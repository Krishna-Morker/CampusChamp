"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Loader from "@/components/Loader";

function QuizResultPage({ params }) {
  const { quizId } = use(params); // Extract quizId from params
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState([]);
  const [totQue,setTotQue] = useState(0)
  const router = useRouter();

  useEffect(() => {
    if (quizId) {
      fetchQuizResults(); // Fetch quiz results when quizId is available
    }
  }, [quizId]);

  const fetchQuizResults = async () => {
    try {
      const response = await axios.post(`/api/quiz`, {
        ge: "fetchQuizResults", // Triggering the fetchQuizResults route
        quizId,
      });
      setAttempts(response.data?.attempts || []); // Set attempts if available
      setTotQue(response.data?.totalQuestions)
      setLoading(false);
    } catch (error) {
      console.error("Error fetching quiz results:", error);
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
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-gray-400">
              <thead>
                <tr>
                  <th className="px-4 py-2">Student Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Score</th>
                  <th className="px-4 py-2">Attempted At</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((attempt, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{attempt.studentName}</td> 
                    <td className="px-4 py-2">{attempt.studentEmail}</td> 
                    <td className="px-4 py-2">{attempt.score}/{totQue}</td>
                    <td className="px-4 py-2">{new Date(attempt.attemptedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizResultPage;
