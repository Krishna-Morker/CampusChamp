"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {useUser} from '@clerk/nextjs';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [joinCodeVisible, setJoinCodeVisible] = useState(null);
  const [inputJoinCode, setInputJoinCode] = useState('');
  const{user}=useUser();

  // Fetch courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        let p=user.id
     let id=await axios.post('/api/user',{id:p})
      const fg=id.data._id
      const ge="get"
        const response = await axios.post('/api/course',{ge,id:fg});
        setCourses(response?.data);
        //console.log(courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  // Handle "Join Code" button click to show input
  const handleJoinCodeClick = (courseId) => {
    setJoinCodeVisible(courseId);
  };

  // Handle join code submission
  const handleJoinCodeSubmit = (courseId) => {
    // Implement join logic here (e.g., send join code to backend)
    console.log(`Joining course ${courseId} with code ${inputJoinCode}`);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Available Courses</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div key={course._id} className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{course.CourseName}</h2>
            <p className="text-gray-700 mb-4">Professor: {course.ProfessorName}</p>

            {joinCodeVisible === course._id ? (
              <div>
                <input
                  type="text"
                  value={inputJoinCode}
                  onChange={(e) => setInputJoinCode(e.target.value)}
                  placeholder="Enter Join Code"
                  className="w-full p-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <button
                  onClick={() => handleJoinCodeSubmit(course._id)}
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
    </div>
  );
};

export default CoursesPage;
