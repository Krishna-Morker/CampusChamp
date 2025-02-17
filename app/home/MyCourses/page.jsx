"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { set } from 'mongoose';
import { useRouter } from 'next/navigation';
import Loader from '../../../components/Loader';

const CoursesPage = () => {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
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
        setLoading(false);
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
  
  if (loading) return <Loader />;

  return (
    <div className="p-8 min-h-screen"
    style={{ backgroundColor: '#242527' }}>
      <h1 className="text-5xl font-bold text-center mb-8 text-white-800">My Courses</h1>
      {courses.length === 0 ? (
        <h1 className='text-3xl font-bold text-center mb-9 text-white-800'>No Courses Available :)</h1>
      ) : (
        <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
              <div
              key={course._id}
              className="p-8 rounded-xl shadow-2xl transition-transform transform hover:scale-105 hover:shadow-2xl flex flex-col"
              style={{  backgroundColor: '#31363f'}}>
             {(prof===1) ? (<button
                onClick={() => handleDeleteCourse(course._id)}
                className="absolute top-2 right-2 bg-red-500 text-white-950 py-1 px-2 rounded-md hover:bg-red-600 transition duration-150"
              >
                Delete
              </button>) : (<button
                onClick={() => handleaveCourse(course._id)}
                className="absolute top-2 right-2 bg-red-500 text-white-950 py-1 px-2 rounded-md hover:bg-red-600 transition duration-150"
              >
                Leave
              </button>)}
              <h2 className="text-3xl font-extrabold text-center text-white-950 mb-7">{course.CourseName}</h2>
              <div className="text-center flex-grow">
        <p className="text-lg text-white-800 mb-2">
          <span className="font-semibold text-white-500">Professor: {course.ProfessorName}</span>
        </p>
        <p className="text-1xl font-normal text-white-900 leading-relaxed italic p-4">
          {course.Description || "No description provided for this course."}
        </p>
      </div>
              <button
                onClick={() => router.push(`/home/Course/${course._id}`)}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-150"
              >
                Visit Course
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;