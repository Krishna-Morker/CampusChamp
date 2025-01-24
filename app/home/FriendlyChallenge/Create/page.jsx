"use client";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import Loader from '@/components/Loader';
import { useUser } from "@clerk/nextjs";

const CreateFriendlyChallenge = () => {
  const [selectedTopic, setSelectedTopic] = useState("Miscellaneous");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const user = useUser();
  const [questions, setQuestions] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Selected Topic:", selectedTopic);
    console.log("Selected Student:", selectedStudent);
    // Add further logic here (e.g., send data to a server)
    
    const topic = selectedTopic;
    const ge="getQuestions";
    const questions = await axios.post('/api/friendlychallenge', {ge , topic});
    // console.log(questions);

    setQuestions(questions.data);

    const dbUser = await axios.post('/api/user',user.user);
    // console.log(dbUser.data)

    const challenge = {
      challengerId: dbUser.data._id,
      challengedId: selectedStudent,
      topic: selectedTopic,
      questions: questions.data,
    };

    try {
      const ge = "add";
      const response = await axios.post('/api/friendlychallenge', {ge , challenge});
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/friendlychallenge');
        const filteredStudents = response.data.filter(student => student.clerkId !== user.user.id);
        // console.log(filteredStudents);
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

  if(loading) <Loader />
  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="topic">Choose a topic:</label>
      <div>
        <select
          id="topic"
          name="topic"
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          required
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
      <div>
        <label htmlFor="student">Select a Student:</label>
        <select
          id="student"
          name="student"
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          required
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
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default CreateFriendlyChallenge;
