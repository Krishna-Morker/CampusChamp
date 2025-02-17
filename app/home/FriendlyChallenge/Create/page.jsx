"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../../../../components/Loader";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const CreateFriendlyChallenge = () => {
  const [selectedTopic, setSelectedTopic] = useState("Miscellaneous");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const user = useUser();
  const [questions, setQuestions] = useState([]);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const topic = selectedTopic;
    const ge = "getQuestions";
    const questions = await axios.post("/api/friendlychallenge", { ge, topic });

    setQuestions(questions.data);

    const dbUser = await axios.post("/api/user", user.user);

    const challenge = {
      challengerId: dbUser.data._id,
      challengedId: selectedStudent,
      topic: selectedTopic,
      questions: questions.data,
    };

    try {
      const ge = "add";
      await axios.post("/api/friendlychallenge", { ge, challenge });
      router.push("/home/FriendlyChallenge/Pending");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/friendlychallenge");
        const filteredStudents = response.data.filter(
          (student) => student.clerkId !== user.user.id
        );
        setStudents(filteredStudents);
        setError(null);
      } catch (err) {
        setError("Failed to load Students data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-400 text-center mt-4">{error}</p>;

  return (
    <form 
      onSubmit={handleSubmit} 
      className="max-w-xl mx-auto bg-gray-900 p-8 rounded-lg shadow-lg text-white space-y-6 mt-10"
    >
      <h1 className="text-2xl font-bold text-center text-gray-200">Create Friendly Challenge</h1>

      <div className="flex flex-col">
        <label htmlFor="topic" className="mb-2 text-lg font-medium text-gray-300">
          Choose a Topic:
        </label>
        <select
          id="topic"
          name="topic"
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          required
          className="bg-gray-800 border border-gray-700 text-white rounded-md p-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="Miscellaneous">Miscellaneous</option>
          <option value="React">React</option>
          <option value="Node">Node</option>
          <option value="Express">Express</option>
          <option value="Algorithms">Algorithms</option>
          <option value="Data Structures">Data Structures</option>
          <option value="Javascript">Javascript</option>
          <option value="DBMS">DBMS</option>
          <option value="HTML">HTML</option>
          <option value="CSS">CSS</option>
          <option value="OOPS">OOPS</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="student" className="mb-2 text-lg font-medium text-gray-300">
          Select a Student:
        </label>
        <select
          id="student"
          name="student"
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          required
          className="bg-gray-800 border border-gray-700 text-white rounded-md p-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            -- Select a Student --
          </option>
          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.email}
            </option>
          ))}
        </select>
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default CreateFriendlyChallenge;
