"use client"
import { use, useEffect, useState } from 'react'
import Loader from '@/components/Loader';
import axios from 'axios';

export default function ViewAttendance({ params }) {
    const { id } = use(params);
    const [courseId, setCourseId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            try {
                const ge = "percentage";
                const response = await axios.post(`/api/attendance`, { id: courseId, ge });
                console.log(response.data)
                setStudents(response.data);
            } catch (error) {
                console.log("Error fetching students:", error);
            } finally {
                setLoading(false);
            }
        };

        if(courseId) fetchStudents();
    }, [courseId]);

    useEffect(() => {
        if (id) setCourseId(id);
    }, [id]);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="flex justify-center items-start pt-8 h-screen bg-gray-900"
            style={{ backgroundColor: '#242527' }}>
            <table className="w-11/12 md:w-3/4 lg:w-2/3 max-w-4xl bg-gray-800 text-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-700">
                        <th className="py-3 px-4 border-b-2 border-green-500 text-green-400">Avatar</th>
                        <th className="py-3 px-4 border-b-2 border-green-500 text-green-400">Username</th>
                        <th className="py-3 px-4 border-b-2 border-green-500 text-green-400">Email</th>
                        <th className="py-3 px-4 border-b-2 border-green-500 text-green-400">Percentage Attendance</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => {
                        const isEvenRow = index % 2 === 0;
                        const rowBgColor = isEvenRow ? 'bg-gray-800' : 'bg-gray-700';

                        return (
                            <tr key={student.clerkId || index} className={`${rowBgColor} hover:bg-gray-600`}>
                                <td className="py-3 px-4 border-b border-gray-600 flex justify-center">
                                    <img src={student.studentInfo.avatar} alt={student.studentInfo.username} className="w-10 h-10 rounded-full" />
                                </td>
                                <td className="py-3 px-4 border-b border-gray-600">{student.studentInfo.username || `${student.studentInfo.firstName} ${student.studentInfo.lastName}`}</td>
                                <td className="py-3 px-4 border-b border-gray-600">{student.studentInfo.email}</td>
                                <td className="py-3 px-4 border-b border-gray-600 text-center">{student.percentage}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}