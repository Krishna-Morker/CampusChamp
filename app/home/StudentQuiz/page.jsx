"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Loader from '../../../components/Loader';

export default function StudentAttendancePage() {
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    const [prof, isProf] = useState(0);
    const [userData, setUserData] = useState(null);

    // Fetch courses from the backend
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                let p = user.id;
                let idResponse = await axios.post('/api/user', { id: p });
                const userId = idResponse.data._id;

                setUserData(idResponse.data);
                isProf(idResponse.data.prof);
                const ge = "myattendance";
                
                // Fetch courses with attendance data
                const response = await axios.post(`/api/attendance`, { ge, id: userId });
                
                // Assume response.data contains the courses and attendance percentages
                setCourses(response.data); // Adjust based on your backend response
                setLoading(false);

            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourses();
    }, [user]);

    if (loading) return <Loader />;
    
    return (
        <div className="p-8 min-h-screen" style={{ backgroundColor: '#242527' }}>
            <h1 className="text-5xl font-bold text-center mb-8 text-white">Enrolled Courses</h1>
            {courses.length === 0 ? (
                <h1 className='text-3xl font-bold text-center mb-9 text-white'>No Courses Enrolled :)</h1>
            ) : (
                <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                        <div
                            key={course.course._id}
                            className="relative p-8 rounded-xl shadow-2xl transition-transform transform hover:scale-105 hover:shadow-2xl flex flex-col"
                            style={{ backgroundColor: '#31363f' }}
                        >
                            {/* Display Attendance Percentage in the top right corner */}
                            <div className="absolute top-3 right-4 bg-red-500 text-white px-2 rounded-md shadow-md">
                                {course.attendancePercentage}%
                            </div>
                            <h2 className="text-3xl font-extrabold text-center text-white mb-7">
                                {course.course.CourseName}
                            </h2>
                            <div className="text-center flex-grow">
                                <p className="text-lg text-white mb-2">
                                    <span className="font-semibold text-white">Professor: {course.course.ProfessorName}</span>
                                </p>
                                <p className="text-1xl font-normal text-white leading-relaxed italic p-4">
                                    {course.course.Description || "No description provided for this course."}
                                </p>
                            </div>
                            <button
                                onClick={() => router.push(`/home/StudentQuiz/${course.course._id}`)}
                                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-150"
                            >
                                View Quiz
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}