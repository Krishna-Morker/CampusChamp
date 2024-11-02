"use client";
import axios from 'axios';
import { use, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

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
        const ge = "present";
        const response = await axios.post("/api/assignment", {
          id: assignmentId,
          ge,
        });
        console.log(response.data, "user");
        setStudents(response.data); // Assuming response.data is an array of students
      } catch (error) {
        console.log("Error fetching student data:", error);
      }
    };

    if (assignmentId) fetchStudentData();
  }, [assignmentId]);

  const handleRemoveAssignment = async (studentId) => {
    try {
      const ge="remove-assignment"
      const response = await axios.post("/api/assignment", {
        assignmentId,
        studentId,
        ge,
      });
      toast.success(response.data);

      const updatedStudents = students.filter(student => student.user._id !== studentId);
      setStudents(updatedStudents);
    } catch (error) {
      console.log("Error removing assignment:", error);
    }
  };

  // Separate students into those who submitted on time and those who submitted late
  const onTimeStudents = students.filter(student => 
    student.submissionDate && new Date(student.submissionDate) <= new Date(student.duedate)
  );

  const lateStudents = students.filter(student => 
    student.submissionDate && new Date(student.submissionDate) > new Date(student.duedate)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Student Submission Status</h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">On-Time Submissions</h2>
          {onTimeStudents.length === 0 ? (
            <p className="text-center text-gray-600">No students submitted on time.</p>
          ) : (
            <div className="space-y-4">
              {onTimeStudents.map((student) => (
                <div
                  key={student.user._id}
                  className="flex items-center p-4 border border-gray-300 rounded-md shadow-sm transition-transform transform hover:scale-105"
                >
                  <img
                    src={student.user.avatar}
                    alt={`${student.user.username}'s avatar`}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div className="flex-grow">
                    <h2 className="text-lg font-medium text-gray-700">{student.user.username}</h2>
                    <p className="text-gray-600 mb-1">Email: {student.user.email}</p>
                    <a
                      href={student.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-full transition-transform duration-150 hover:scale-105"
                    >
                      View Assignment
                    </a>
                    <button
                      onClick={() => handleRemoveAssignment(student.user._id)}
                      className="ml-4 inline-block bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition duration-150"
                    >
                      Remove Assignment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Late Submissions</h2>
          {lateStudents.length === 0 ? (
            <p className="text-center text-gray-600">No late submissions found.</p>
          ) : (
            <div className="space-y-4">
              {lateStudents.map((student) => (
                <div
                  key={student.user._id}
                  className="flex items-center p-4 border border-gray-300 rounded-md shadow-sm transition-transform transform hover:scale-105"
                >
                  <img
                    src={student.user.avatar}
                    alt={`${student.user.username}'s avatar`}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                    <div className="flex-grow">
                    <h2 className="text-lg font-medium text-gray-700">{student.user.username}</h2>
                    <p className="text-gray-600 mb-1">Email: {student.user.email}</p>
                    <a
                      href={student.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-full transition-transform duration-150 hover:scale-105"
                    >
                      View Assignment
                    </a>
                    <button
                      onClick={() => handleRemoveAssignment(student.user._id)}
                      className="ml-4 inline-block bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition duration-150"
                    >
                      Remove Assignment
                    </button>
                  </div>
                  <p className="text-red-500 mt-2">Late submission</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
