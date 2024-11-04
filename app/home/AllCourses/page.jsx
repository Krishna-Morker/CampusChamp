"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { toast } from 'react-toastify';
import { FaGalacticSenate } from 'react-icons/fa';
import Loader from '@/components/Loader';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [joinCodeVisible, setJoinCodeVisible] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inputJoinCode, setInputJoinCode] = useState('');
  const { user } = useUser();
  const [userid,setuserid]=useState(null);
  const fetchCourses = async () => {
    try {
      let p = user.id;
      let id = await axios.post('/api/user', { id: p });
      const fg = id.data._id;
      setuserid(fg)
      const ge = "get";
      const response = await axios.post('/api/course', { ge, id: fg });
      setCourses(response?.data);
      setLoading(false);
    } catch (error) {
      console.log('Error fetching courses:', error);
    }
  };

  // Fetch courses from the backend
  useEffect(() => {
   
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
  if (loading) return <Loader />;
  return (
    <div className="p-8 bg-gradient-to-b from-gray-600 to-gray-50 min-h-screen">
      <h1 className="text-5xl font-bold text-center mb-8 text-white-800">
        Available Courses
      </h1>
      {courses.length === 0 ? (
        <h1 className='text-3xl font-bold text-center mb-9 text-gray-800'>No Avaliable Courses:)</h1 >
      ) :
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 px-4">
  {courses.map((course) => (
    <div
    key={course._id}
    className="bg-gradient-to-br from-gray-600 to-gray-100 p-8 rounded-xl shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
    style={{
      background: 'radial-gradient(circle, rgba(156, 163, 175, 1) 20%, rgba(30, 40, 55, 1) 90%)',
    }}
  >
      <h2 className="text-2xl font-bold text-center text-gray-950 mb-4">
        {course.CourseName}
      </h2>

      <div className="text-center">
        <p className="text-lg text-gray-800 mb-2">
          <span className="font-semibold text-black-900">Professor: {course.ProfessorName}</span>
        </p>
        <p className="font-normal text-1xl text-gray-900 leading-relaxed italic p-3">
          {course.Description || "No description provided for this course."}
        </p>
      </div>

      {joinCodeVisible === course._id ? (
        <div className="mt-4">
          <input
            type="text"
            value={inputJoinCode}
            onChange={(e) => setInputJoinCode(e.target.value)}
            placeholder="Enter Join Code"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mb-3 text-gray-700"
          />
          <button
            onClick={() => handleJoinCodeSubmit(course)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-150"
          >
            Submit Join Code
          </button>
        </div>
      ) : (
        <button
          onClick={() => handleJoinCodeClick(course._id)}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-150 mt-4"
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
