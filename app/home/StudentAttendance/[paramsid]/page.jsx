"use client";
import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

export default function ViewAttendancePage({params}) {
    const router = useRouter();
    const { paramsid } = use(params);
    const { user } = useUser();
    const [prof,isprof]=useState(0);
    const [userId,setuserId]=useState(null);
    const [courseId,setCourseId] = useState(null)
    const [StudentAttendance,setStudentAttendance] = useState([])
    const [presentDates,setPresentDates] = useState([])
    const [absentDates,setAbsentDates] = useState([])
    const [events,setEvents] = useState([])
    
    // Fetch Attendance from the backend
    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                let p = user.id;
                let id = await axios.post('/api/user', { id: p });
                const fg = id.data._id;
                
                setuserId(id.data._id)
                isprof(id.data.prof)

                
                const ge = "viewattendance";
                // console.log(fg,paramsid,ge);

                const attendance = await axios.post(`/api/attendance`,{courseId,userId: fg,ge});

                if(attendance) setStudentAttendance(attendance.data)    

                const temp=attendance.data;
                // console.log(temp)
                
                const pdates = temp.filter(record => record.status === "Present").map(record => record.date);
                const pformattedDates = pdates.map(dateStr => {
                    const date = new Date(dateStr);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
                    const day = String(date.getDate()).padStart(2, '0');
                    
                    return `${year}-${month}-${day}`;
                });
                // console.log(pformattedDates)
                if(pformattedDates) setPresentDates(pformattedDates);

                const adates = temp.filter(record => record.status === "Absent").map(record => record.date);
                const aformattedDates = adates.map(dateStr => {
                    const date = new Date(dateStr);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
                    const day = String(date.getDate()).padStart(2, '0');
                    
                    return `${year}-${month}-${day}`;
                });
                // console.log(aformattedDates)
                if(aformattedDates) setAbsentDates(aformattedDates);

                const allevents = [
                    ...pformattedDates.map(date => ({
                    title: "Present",
                    start: (date),
                    color: "green" // Color for present dates
                    })),
                    ...aformattedDates.map(date => ({
                    title: "Absent",
                    start: (date),
                    color: "red" // Color for absent dates
                    }))
                ];

                if(allevents) setEvents(allevents);

                console.log(allevents)

            } catch (error) {
                console.error('Error fetching attendance:', error);
            }
        };  
        fetchAttendance();
    }, [courseId]);

    useEffect(() => {
        if(paramsid) setCourseId(paramsid);
    }, [paramsid]);
    
    return (
        <>
            <h1 className="text-center text-2xl font-semibold text-red-800 mb-6">Course Attendance</h1>
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events}
                headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek,dayGridDay'
                }}
            />
        </>
    )
}
