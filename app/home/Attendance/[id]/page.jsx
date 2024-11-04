"use client";
import axios from 'axios';
import { use, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Loader from '@/components/Loader';

function AttendancePage({ params }) {
  const [students, setStudents] = useState([]);
  const { id } = use(params);
  const [courseId, setCourseId] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [submitted, setSubmitted] = useState(false); // Track if attendance is submitted
  const [loading, setLoading] = useState(true); // Loading state
 

  // Fetch students when courseId changes
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const ge = "coursestudent";
        const response = await axios.post(`/api/course`, { id: courseId, ge });
        setStudents(response.data);
        setload(false);
      } catch (error) {
        console.log("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchStudents();
  }, [courseId]);

  // Set courseId from params
  useEffect(() => {
    if (id) setCourseId(id);
  }, [id]);
  
  // Check attendance status when courseId and date change
  useEffect(() => {
    const checkAttendanceStatus = async () => {
      setLoading(true); // Start loading
      try {
        const ge = "attstatus";
        const response = await axios.post(`/api/attendance`, { courseId, date, ge });
        console.log(response.data);
        // Check if response.data is structured correctly
        if (Array.isArray(response.data)) {
          const statusMap = {};
          response.data.forEach(record => {
            statusMap[record.studentId] = record.status; // Map studentId to their status
          });
          
          setAttendanceStatus(statusMap); // Update attendanceStatus state
          console.log(statusMap,"Map");
        }
        if(response.data.length !== 0){
          setSubmitted(true);
        }
       // Set submitted to true if statuses were found
      } catch (error) {
        console.error("Error checking attendance status:", error);
      } finally {
        setLoading(false); // End loading
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
    const ge = "submitattendance";
    try {
      const points = prompt(`Enter points to assign to all Present Students`);
      if (!points || isNaN(points)) {
        toast.error("Please enter a valid number.");
        return;
      }
      const response = await axios.post('/api/attendance', { attendanceStatus, courseId, date, ge,points });
      if (response.status === 200) {
        toast.success("Attendance submitted successfully");
        setSubmitted(true); // Set submitted to true
      } else {
        toast.error("Error submitting attendance");
      }
    } catch (error) {
      toast.error("Error submitting attendance");
      console.error(error);
    }
  };
  if(loading){
    return <Loader/>
  }

  return (
    <div className="bg-gradient-to-b from-gray-600 to-gray-50 py-8 px-4 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Course Attendance</h1>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Select Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setSubmitted(false); // Reset submitted when changing the date
            }}
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
                      (attendanceStatus[student._id] === 'Absent' || attendanceStatus[student._id] !== 'Present' && submitted ) ? 'border-red-500 bg-red-100' : 'border-gray-300'}`}
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
                      disabled={attendanceStatus[student._id] === 'Present' || submitted}
                      className={`bg-green-500 text-white py-1 px-3 rounded-full hover:bg-green-600 transition ${submitted ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => handleAttendanceChange(student._id, "Absent")}
                      disabled={attendanceStatus[student._id] === 'Absent' || submitted}
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
