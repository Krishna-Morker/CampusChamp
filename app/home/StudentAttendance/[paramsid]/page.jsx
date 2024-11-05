"use client";
import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function ViewAttendancePage({params}) {
    const router = useRouter();
    const { paramsid } = use(params);
    const { user } = useUser();
    const [prof,isprof]=useState(0);
    const [userId,setuserId]=useState(null);
    const [courseId,setCourseId] = useState(null)
    const [StudentAttendance,setStudentAttendance] = useState([])

    
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
                console.log(attendance.data)
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
            <div>hello</div>
        </>
    )
}
