'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUser } from '@clerk/nextjs';
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import Pusher from 'pusher-js';
import { toast } from "react-toastify";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useUser();
  const [professorCourses, setProfessorCourses] = useState([]);

  // Fetch courses from the backend
  const fetchCourses = async () => {
    try {
      const response = await axios.post('/api/user', { id: user.id });
      const userData = response.data;
      setProfessorCourses(userData.Courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    if (user) fetchCourses();
  }, [user]);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const subscribedChannels = [];

   // Subscribe to channels and set up event bindings
    professorCourses.forEach(courseId => {
      const channel = pusher.subscribe(`course-${courseId}-notifications`);
      subscribedChannels.push(channel);

      channel.bind('student-joined', (data) => {
       toast.success(data.message);
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          { message: data.message, timestamp: new Date() },
        ]);
      });
    });

    // Cleanup on component unmount
    return () => {
      subscribedChannels.forEach(channel => {
        channel.unbind_all();
        channel.unsubscribe();
      });
      pusher.disconnect();
    };
  }, [professorCourses]);

  return (
    <Popover>
      <PopoverTrigger className="relative flex size-10 items-center justify-center rounded-lg">
        <Image 
          src="/bell.svg"
          alt="inbox"
          width={24}
          height={24}
        />
      </PopoverTrigger>
      <PopoverContent align="end" className="shad-popover">
        <ul>
          {notifications.length === 0 && (
            <p className="py-2 text-center text-dark-500">No new notifications</p>
          )}
          {notifications.map((notification, index) => (
            <li key={index} className="py-2 px-4 bg-gray-100 rounded-lg mb-2">
              <p>{notification.message}</p>
              <p className="text-xs text-gray-500">{notification.timestamp.toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

export default Notifications;
