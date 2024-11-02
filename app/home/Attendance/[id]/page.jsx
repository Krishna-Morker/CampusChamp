"use client";
import { use, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

function AttendancePage({ params }) {
  const [students, setStudents] = useState([]);
  const { id } = use(params);
  const [courseId, setCourseId] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [submitted, setSubmitted] = useState(false); // Track if attendance is submitted

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const ge = "coursestudent";
        const response = await axios.post(`/api/course`, { id: courseId, ge });
        setStudents(response.data);
      } catch (error) {
        console.log("Error fetching students:", error);
      }
    };

    if (courseId) fetchStudents();
  }, [courseId]);

  useEffect(() => {
    if (id) setCourseId(id);
  }, [id]);

  // Check if attendance has already been submitted for the current date
  useEffect(() => {
    const checkAttendanceStatus = async () => {
      try {
        const ge="attstatus"
        const response = await axios.post(`/api/attendance`, {
          courseId, date ,ge
        });
        if (response.data) {
          setSubmitted(true);
        } else {
          setSubmitted(false); 
        }
      } catch (error) {
        console.error("Error checking attendance status:", error);
      }
    };

    if (courseId && date) {
      checkAttendanceStatus();
    }
  }, [courseId, date]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceStatus((prevStatus) => ({
      ...prevStatus,
      [studentId]: status,
    }));
  };

  const submitAttendance = async () => {
    const ge="submitattendance"
    const response = await axios.post('/api/attendance', { attendanceStatus, courseId, date, ge });
    toast.success(response.data.message);
    setSubmitted(true); // Set submitted to true
  };

  return (
    <div className="bg-gradient-to-b from-gray-600 to-gray-50 py-8 px-4 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Course Attendance</h1>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Select Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border text-gray-700 border-gray-300 p-2 rounded w-full"
          />
        </div>

        <div className="space-y-4 mb-6">
          {students.length === 0 ? (
            <p className="text-center text-gray-600">No students found for this course.</p>
          ) : (
            students.map((student) => (
              <div
                key={student._id}
                className={`flex items-center p-4 border rounded-md 
                  ${submitted ? 'opacity-50 cursor-not-allowed' : ''} 
                  ${attendanceStatus[student._id] === 'Present' ? 'border-green-500 bg-green-100' : 
                    attendanceStatus[student._id] === 'Absent' ? 'border-red-500 bg-red-100' : 'border-gray-300'}`}
              >
                <img
                  src={student.avatar} // Using a placeholder avatar
                  alt={student.username}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div className="flex-grow">
                  <h2 className="text-lg font-medium text-gray-700">{student.username}</h2>
                  <p className="text-gray-600">Email: {student.email}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAttendanceChange(student._id, "Present")}
                    disabled={submitted || attendanceStatus[student._id] === 'Present'}
                    className={`bg-green-500 text-white py-1 px-3 rounded-full hover:bg-green-600 transition ${submitted ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Present
                  </button>
                  <button
                    onClick={() => handleAttendanceChange(student._id, "Absent")}
                    disabled={submitted || attendanceStatus[student._id] === 'Absent'}
                    className={`bg-red-500 text-white py-1 px-3 rounded-full hover:bg-red-600 transition ${submitted ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Absent
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={submitAttendance}
          disabled={submitted}
          className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition ${submitted ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Submit Attendance
        </button>
      </div>
    </div>
  );
}

export default AttendancePage;
