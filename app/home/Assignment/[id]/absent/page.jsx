"use client";
import axios from 'axios';
import {use, useState, useEffect } from 'react';

function Page({ params }) {
  const { id } = use(params);
  const [assignmentId, setAssignmentId] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (id) setAssignmentId(id);
  }, [id]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const ge = "absent";
        const response = await axios.post("/api/assignment", {
          id: assignmentId,
          ge,
        });
        setStudents(response.data); // Assuming response.data is an array of students
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    if (assignmentId) fetchStudentData();
  }, [assignmentId]);

  return (
    <div className="bg-gradient-to-b from-gray-600 to-gray-50 py-8 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Student Submission Status</h1>

        {students.length === 0 ? (
          <p className="text-center text-gray-600">No student data available.</p>
        ) : (
          <div className="space-y-4">
            {students.map((student) => (
              <div
                key={student._id}
                className="flex items-center p-4 border border-gray-300 rounded-md shadow-sm transition-transform transform hover:scale-105"
              >
                <img
                  src={student.avatar}
                  alt={`${student.username}'s avatar`}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div className="flex-grow">
                  <h2 className="text-lg font-medium text-gray-700">{student.username}</h2>
                  <p className="text-gray-600 mb-1">Email: {student.email}</p>
                  {student.assignmentUrl && (
                    <a
                      href={student.assignmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-full transition-transform duration-150 hover:scale-105"
                    >
                      View Assignment
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
