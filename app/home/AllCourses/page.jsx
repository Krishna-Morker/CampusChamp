"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { toast } from 'react-toastify';
import { FaGalacticSenate } from 'react-icons/fa';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [joinCodeVisible, setJoinCodeVisible] = useState(null);
  const [inputJoinCode, setInputJoinCode] = useState('');
  const { user } = useUser();
  const [userid,setuserid]=useState(null);

  // Fetch courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        let p = user.id;
        let id = await axios.post('/api/user', { id: p });
        const fg = id.data._id;
        setuserid(fg)
        const ge = "get";
        const response = await axios.post('/api/course', { ge, id: fg });
        setCourses(response?.data);
      } catch (error) {
        console.log('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, [user]);

  // Handle "Join Code" button click to show input
  const handleJoinCodeClick = (courseId) => {
    setJoinCodeVisible(courseId);
  };

  // Handle join code submission
  const handleJoinCodeSubmit =async (course) => {
    try {
      
    
   let code=course.JoinCode
   if(code===inputJoinCode){
    const ge = "join";
    const courseId=course._id
    const response = await axios.post('/api/course', { ge, courseid: course._id, userid: userid });
    setCourses(prevCourses => prevCourses.filter(cours => cours._id !== courseId));
    setInputJoinCode('')
     toast.success('Course Joined');
   }else{
    toast.error('Incorrect Join Code');
   }
  } catch (error) {
    console.log('Error fetching courses:', error);
  }
  };

  return (
    <div className="p-8 bg-gradient-to-b from-gray-600 to-gray-50 min-h-screen">
      <h1 className="text-5xl font-bold text-center mb-8 text-white-800">
        Available Courses
      </h1>
      {courses.length === 0 ? (
        <h1 className='text-3xl font-bold text-center mb-9 text-gray-800'>No Avaliable Courses:)</h1 >
      ) :
      <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-3">
        { courses.map((course) => (
          <div key={course._id} className="bg-gray-50 p-10 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <h2 className="text-2xl text-center font-semibold text-gray-800 mb-2">{course.CourseName}</h2>
            <p className="text-gray-700 text-center m-4">Professor: {course.ProfessorName}</p>
            <p className="text-gray-700 text-center m-4"> {course.Description}</p>

            {joinCodeVisible === course._id ? (
              <div>
                <input
                  type="text"
                  value={inputJoinCode}
                  onChange={(e) => setInputJoinCode(e.target.value)}
                  placeholder="Enter Join Code"
                  className="w-full p-3 mb-3 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <button
                  onClick={() => handleJoinCodeSubmit(course)}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-150"
                >
                  Submit Join Code
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleJoinCodeClick(course._id)}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-150"
              >
                Join Code
              </button>
            )}
          </div>
        ))}
      </div>
}
    </div>
  );
};

export default CoursesPage;
