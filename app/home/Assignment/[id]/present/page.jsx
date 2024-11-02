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

  useEffect(() => {

    if (assignmentId) fetchStudentData();
  }, [assignmentId]);

  const handleRemoveAssignment = async (studentId) => {
    try {
      const ge = "remove-assignment";
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

  const handleAssignGlobalPoints = async (isOnTime) => {
    const points = prompt(`Enter points to assign to all ${isOnTime ? "on-time" : "late"} submissions:`);
    if (!points || isNaN(points)) {
      toast.error("Please enter a valid number.");
      return;
    }
    const ge="addextra"
    try {
      const response = await axios.post("/api/points", {
        assignmentId,
        points: parseInt(points, 10), // Convert to integer
        isOnTime,
        ge,
      });
      toast.success(response.data); // Notify the user about the success
      // Refresh student data to reflect new points
      fetchStudentData();
    } catch (error) {
      console.log("Error assigning global points:", error);
      toast.error("Error assigning global points.");
    }
  };

  const handleAssignExtraPoints = async (studentId) => {
    const points = prompt("Enter extra points to assign:");
    if (!points || isNaN(points)) {
      toast.error("Please enter a valid number.");
      return;
    }
      const ge="add"
    try {
      const response = await axios.post("/api/points", {
        studentId,
        points: parseInt(points, 10),
        ge,
      });
      toast.success(response.data);
      // Refresh student data to reflect new points
      fetchStudentData();
    } catch (error) {
      console.log("Error assigning extra points:", error);
      toast.error("Error assigning extra points.");
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
    <div className="bg-gradient-to-b from-gray-600 to-gray-50 py-8 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">On-Time Submissions</h2>
            <button
              onClick={() => handleAssignGlobalPoints(true)}
              className="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600 transition duration-150"
            >
              Assign Points to All On-Time
            </button>
          </div>
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
                    <p className="text-gray-600 mb-1">Total Points: {student.user.points}</p>
                    <a
                      href={student.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-full transition-transform duration-150 hover:scale-105"
                    >
                      View Assignment
                    </a>
                    <button
                      onClick={() => handleAssignExtraPoints(student.user._id)}
                      className="ml-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition duration-150"
                    >
                      Add Extra Points
                    </button>
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Late Submissions</h2>
            <button
              onClick={() => handleAssignGlobalPoints(false)}
              className="bg-yellow-500 text-white py-2 px-4 rounded-full hover:bg-yellow-600 transition duration-150"
            >
              Assign Points to All Late
            </button>
          </div>
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
                    <p className="text-gray-600 mb-1">Total Points: {student.user.points }</p>
                    <a
                      href={student.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-full transition-transform duration-150 hover:scale-105"
                    >
                      View Assignment
                    </a>
                    <button
                      onClick={() => handleAssignExtraPoints(student.user._id)}
                      className="ml-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition duration-150"
                    >
                      Add Extra Points
                    </button>
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
      </div>
    </div>
  );
}

export default Page;
