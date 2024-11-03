"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { set } from 'mongoose';
import { useRouter } from 'next/navigation';

const CoursesPage = () => {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [joinCodeVisible, setJoinCodeVisible] = useState(null);
  const [inputJoinCode, setInputJoinCode] = useState('');
  const { user } = useUser();
  const [prof,isprof]=useState(0);
  const [userd,setuserd]=useState(null);

  // Fetch courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        let p = user.id;
        let id = await axios.post('/api/user', { id: p });
        const fg = id.data._id;
        
        setuserd(id.data)
        isprof(id.data.prof)
        const ge = "mycou";
        const response = await axios.post(`/api/course`, { ge, id: fg });
        setCourses(response?.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, [user]);

  // Handle course deletion
  const handleaveCourse = async (courseId) => {
    try {
      await axios.delete(`/api/course`,{params:{id:courseId,userid:userd._id}}); // Adjust the endpoint if needed
      setCourses(courses.filter(course => course._id !== courseId)); // Remove the deleted course from the state
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await axios.delete(`/api/course`,{params:{id:courseId,profid:userd._id,ge:"del"}}); // Adjust the endpoint if needed
      setCourses(courses.filter(course => course._id !== courseId)); // Remove the deleted course from the state
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };
  


  return (
    <div className="p-8 bg-gradient-to-b from-gray-600 to-gray-50 min-h-screen">
      <h1 className="text-5xl font-bold text-center mb-8 text-white-800">Take Attendance</h1>
      {courses.length === 0 ? (
        <h1 className='text-3xl font-bold text-center mb-9 text-gray-800'>No Courses Available :)</h1>
      ) : (
        <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
              <div
              key={course._id}
              className="bg-gradient-to-br from-gray-600 to-gray-100 p-8 rounded-xl shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
              style={{
                background: 'radial-gradient(circle, rgba(156, 163, 175, 1) 20%, rgba(30, 40, 55, 1) 90%)',
              }}
            >
             {(prof===1) ? (<button
                onClick={() => handleDeleteCourse(course._id)}
                className="absolute top-2 right-2 bg-red-500 text-gray-950 py-1 px-2 rounded-md hover:bg-red-600 transition duration-150"
              >
                Delete
              </button>) : (<button
                onClick={() => handleaveCourse(course._id)}
                className="absolute top-2 right-2 bg-red-500 text-gray-950 py-1 px-2 rounded-md hover:bg-red-600 transition duration-150"
              >
                Leave
              </button>)}
              <h2 className="text-2xl text-center font-semibold text-gray-950 mb-4">{course.CourseName}</h2>
              <div className="text-center">
        <p className="text-lg text-gray-800 mb-2">
          <span className="font-semibold text-black-500">Professor: {course.ProfessorName}</span>
        </p>
        <p className="text-1xl font-normal text-gray-900 leading-relaxed italic p-4">
          {course.Description || "No description provided for this course."}
        </p>
      </div>
              <button
                onClick={() => router.push(`/home/Attendance/${course._id}`)}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-150"
              >
                Take Attendance
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;