"use client";
import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Loader from '@/components/Loader';
import styles from './ViewAttendancePage.module.css';

export default function ViewAttendancePage({ params }) {
    const router = useRouter();
    const { paramsid } = use(params);
    const { user } = useUser();
    const [prof, isprof] = useState(0);
    const [userId, setuserId] = useState(null);
    const [courseId, setCourseId] = useState(null)
    const [StudentAttendance, setStudentAttendance] = useState([])
    const [presentDates, setPresentDates] = useState([])
    const [absentDates, setAbsentDates] = useState([])
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true);

    // Fetch Attendance from the backend
    // Update dependencies for useEffect to ensure userId and courseId are set before fetching attendance
    useEffect(() => {
        const fetchAttendance = async () => {
            if (!user || !courseId) return;  // Wait for user and courseId to be defined

            try {
                let p = user.id;
                let id = await axios.post('/api/user', { id: p });
                const fg = id.data._id;

                setuserId(fg);
                isprof(id.data.prof);

                const ge = "viewattendance";
                const attendance = await axios.post(`/api/attendance`, { courseId, userId: fg, ge });

                if (attendance) setStudentAttendance(attendance.data);

                const temp = attendance.data;

                const pdates = temp.filter(record => record.status === "Present").map(record => record.date);
                const pformattedDates = pdates.map(formatDate);
                if (pformattedDates) setPresentDates(pformattedDates);

                const adates = temp.filter(record => record.status === "Absent").map(record => record.date);
                const aformattedDates = adates.map(formatDate);
                if (aformattedDates) setAbsentDates(aformattedDates);

                const allevents = [
                    ...pformattedDates.map(date => ({
                        title: "Present",
                        start: date,
                        color: "green"
                    })),
                    ...aformattedDates.map(date => ({
                        title: "Absent",
                        start: date,
                        color: "red"
                    }))
                ];

                if (allevents) setEvents(allevents);
                setLoading(false);
                console.log(allevents);
            } catch (error) {
                console.error('Error fetching attendance:', error);
            }
        };

        fetchAttendance();
    }, [courseId, user]);  // Add user to dependency array

    useEffect(() => {
        if (paramsid) setCourseId(paramsid);
    }, [paramsid]);

    // Helper function to format date consistently
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    if(loading) return <Loader />
    return (
        <>
       
            <div className="calendarContainer">
                <h1 className="calendarTitle text-4xl text-red-800 text-center font-extrabold largeText">Course Attendance</h1>
                <div className='p-8 '>

                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,dayGridWeek,dayGridDay'
                    }}
                      dayHeaderContent={(date) => {
                    const dayName = date.date.toLocaleString('en-US', { weekday: 'long' }); // Get the full day name
                    return (
                        <span className="text-black font-bold">{dayName}</span>
                    );
                }}
                    eventContent={(eventInfo) => (
                        <div className="custom-event" style={{ padding: '4px' }}>
                            <span>{eventInfo.event.title}</span>
                        </div>
                    )}
                    height="auto"
                    contentHeight="auto"
                    />
                </div>
            </div>
        </>
    )
}