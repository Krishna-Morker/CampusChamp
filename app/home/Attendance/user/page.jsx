"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { set } from 'mongoose';
import { useRouter } from 'next/navigation';

const CoursesPage = () => {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const { user } = useUser();
  const [prof,isprof]=useState(0);
  const [userd,setuserd]=useState(null);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/attendance/courses');
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses with attendance:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

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
          <div className="max-w-3xl mx-auto bg-gray-400 rounded-lg shadow-2xl p-6">
      <h1 className="text-5xl font-bold text-center mb-8 text-gray-800">My Courses</h1>
      {courses.length === 0 ? (
        <h1 className='text-3xl font-bold text-center mb-9 text-gray-800'>No Courses Available :)</h1>
      ) : (
        <div className="grid gap-9 grid-cols-1">
          {courses.map((course) => (
              <div
              key={course._id}
              className="bg-gradient-to-br from-gray-600 to-gray-100 p-8 rounded-xl shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
              style={{
                background: 'radial-gradient(circle, rgba(156, 163, 175, 1) 20%, rgba(30, 40, 55, 1) 90%)',
              }}
            >
           
              <h2 className="text-2xl text-left font-semibold text-white-950 mb-4">{course.CourseName}</h2>
              <div className="text-left">
        <p className="text-lg text-white-800 mb-2">
          <span className="font-semibold text-white-500">Professor: {course.ProfessorName}</span>
        </p>
        <p className="text-1xl font-normal text-gray-900 leading-relaxed italic p-4">
          {course.Description || "No description provided for this course."}
        </p>
      </div>
              <button
                onClick={() => router.push(`/home/Course/${course._id}`)}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-150"
              >
                See Attendance
              </button>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default CoursesPage;
