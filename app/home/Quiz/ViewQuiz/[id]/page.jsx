"use client";
import { use,useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Use for navigation
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";

function ViewQuizPage({ params }) {
  const { id } = use(params); // Correctly extract courseId from route params
  const [quizzes, setQuizzes] = useState([]); // Initialize quizzes as an empty array
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // For navigation

  useEffect(() => {
    if (id) {
      fetchQuizzes();
    }
  }, [id]);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.post(`/api/quiz`, {
        ge: "fetch",
        courseId: id,
      });
      setQuizzes(response.data.quizzes || []); // Default to empty array if undefined
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch quizzes.");
      setQuizzes([]); // Set to empty array in case of error
      setLoading(false);
    }
  };

  const handleViewResult = (quizId) => {
    // Find the selected quiz from the quizzes array
    const selectedQuiz = quizzes.find((quiz) => quiz._id === quizId);
  
    if (selectedQuiz) {
      // Navigate to the result page and pass the quiz data via query parameter
      const quizData = JSON.stringify(selectedQuiz); // Stringify the selected quiz data
  
      // Pass quizId and quizData in the query string
      router.push(`/home/Quiz/ViewQuiz/${id}/${quizId}`);
    }
  };
  

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-8 min-h-screen" style={{ backgroundColor: "#242527" }}>
      <div className="max-w-3xl mx-auto rounded-lg shadow-lg p-6" style={{ backgroundColor: "#31363f" }}>
        <h1 className="text-2xl font-semibold text-white-800 mb-6">View Quizzes</h1>

        {quizzes.length === 0 ? (
          <p className="text-white-600">No quizzes found for this course.</p>
        ) : (
          quizzes.map((quiz) => (
            <div key={quiz._id} className="p-4 border rounded-md mb-4" style={{ backgroundColor: "#242527" }}>
              <h3 className="text-white-700"><label className="text-green-500">Title:</label> {quiz.title}</h3>
              <p className="text-white-600"><label className="text-green-500">Description:</label> {quiz.description}</p>
              <p className="text-gray-400">
                Start: {new Date(quiz.startTime).toLocaleString()} | End: {new Date(quiz.endTime).toLocaleString()}
              </p>
              <button
                onClick={() => handleViewResult(quiz._id)} // Redirect to result page
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                View Result
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ViewQuizPage;
