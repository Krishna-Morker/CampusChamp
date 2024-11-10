"use client";
import axios from 'axios';
import { use,useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Loader from '@/components/Loader';
import Modal from '@/components/Modal'; // Adjust the path as necessary

function Page({ params }) {
  const { id } = use(params);
  const [assignmentId, setAssignmentId] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isOnTime, setIsOnTime] = useState(null);

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
      setStudents(response.data);
      setLoading(false);
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

  const openModalForGlobalPoints = (isOnTimeSubmissions) => {
    setIsOnTime(isOnTimeSubmissions);
    setModalMessage(`Enter points to assign to all ${isOnTimeSubmissions ? "on-time" : "late"} submissions:`);
    setIsModalOpen(true);
  };

  const openModalForExtraPoints = (studentId) => {
    setModalMessage("Enter extra points to assign:");
    setIsOnTime(studentId);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async () => {
    if (!inputValue || isNaN(inputValue)) {
      toast.error("Please enter a valid number.");
      return;
    }

    const points = parseInt(inputValue, 10);
    const ge = isOnTime === true || isOnTime === false ? "addextra" : "add";
    const requestBody = {
      assignmentId,
      points,
      isOnTime,
      ge,
      ...(typeof isOnTime === "string" ? { studentId: isOnTime } : { isOnTime }),
    };

    try {
      const response = await axios.post("/api/points", requestBody);
      toast.success(response.data);
      fetchStudentData();
    } catch (error) {
      console.log("Error assigning points:", error);
      toast.error("Error assigning points.");
    } finally {
      setIsModalOpen(false);
      setInputValue('');
    }
  };

  const onTimeStudents = students.filter(student =>
    student.submissionDate && new Date(student.submissionDate) <= new Date(student.duedate)
  );

  const lateStudents = students.filter(student =>
    student.submissionDate && new Date(student.submissionDate) > new Date(student.duedate)
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-8 min-h-screen" style={{ backgroundColor: '#242527' }}>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        mes={modalMessage}
        setInputValue={setInputValue}
        InputValue={inputValue}
      />
      <div className="max-w-4xl mx-auto rounded-lg shadow-lg p-6" style={{ backgroundColor: '#31363f' }}>
        {/* On-Time Submissions */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white-800">On-Time Submissions</h2>
            <button
              onClick={() => openModalForGlobalPoints(true)}
              className="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600 transition duration-150"
            >
              Assign Points to All On-Time
            </button>
          </div>
          {onTimeStudents.length === 0 ? (
            <p className="text-center text-white-600">No students submitted on time.</p>
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
                    <h2 className="text-lg font-medium text-white-700">{student.user.username}</h2>
                    <p className="text-white-600 mb-1">Email: {student.user.email}</p>
                    <p className="text-white-600 mb-1">Total Points: {student.user.points}</p>
                    <a
                      href={student.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-full transition-transform duration-150 hover:scale-105"
                    >
                      View Assignment
                    </a>
                    <button
                      onClick={() => openModalForExtraPoints(student.user._id)}
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
        {/* Late Submissions */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white-800">Late Submissions</h2>
            <button
              onClick={() => openModalForGlobalPoints(false)}
              className="bg-yellow-500 text-white py-2 px-4 rounded-full hover:bg-yellow-600 transition duration-150"
            >
              Assign Points to All Late
            </button>
          </div>
          {lateStudents.length === 0 ? (
            <p className="text-center text-white-600">No late submissions found.</p>
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
                    <h2 className="text-lg font-medium text-white-700">{student.user.username}</h2>
                    <p className="text-white-600 mb-1">Email: {student.user.email}</p>
                    <p className="text-white-600 mb-1">Total Points: {student.user.points}</p>
                    <a
                      href={student.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-full transition-transform duration-150 hover:scale-105"
                    >
                      View Assignment
                    </a>
                    <button
                      onClick={() => openModalForExtraPoints(student.user._id)}
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
