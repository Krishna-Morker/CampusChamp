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
  const [use, setUse] = useState([]);

  // Fetch courses and notifications from the backend
  const fetchCoursesAndNotifications = async () => {
    try {
      const response = await axios.post('/api/user', { id: user.id });
      const userData = response.data;
      setProfessorCourses(userData.Courses || []);
      setUse(userData);
      console.log(userData)
      const notifica = await axios.post('/api/notification', { id: userData._id, ge: "getnotification" });
      setNotifications(notifica.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (user) fetchCoursesAndNotifications();
  }, [user]);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const subscribedChannels = [];
    if(use?.prof===1){
    professorCourses.forEach(courseId => {
      const channel = pusher.subscribe(`course-${courseId}-notifications`);
      subscribedChannels.push(channel);

      channel.bind('student-joined', (data) => {
          toast.success(data.message);
          fetchCoursesAndNotifications();
      });
    });

    return () => {
      subscribedChannels.forEach(channel => {
        channel.unbind_all();
        channel.unsubscribe();
      });
      pusher.disconnect();
    };
  }
  }, [professorCourses, user]);

  // Function to mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        readStatus: true,  // Marking as read
      }));
      setNotifications(updatedNotifications); // Update state to reflect changes

      // Make an API call to mark notifications as read on the backend
      await axios.post('/api/notification', { notifications: updatedNotifications, ge: "markAsRead" });
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  return (
    <Popover onOpenChange={(isOpen) => !isOpen && markAllAsRead()}>
      <PopoverTrigger className="relative flex items-center justify-center rounded-lg">
        <Image 
          src="/bell.svg"
          alt="Notifications"
          width={24}
          height={24}
          className="hover:scale-110 transition-transform duration-150"
        />
      </PopoverTrigger>
      <PopoverContent align="end" className="bg-white border border-gray-200 shadow-lg rounded-lg max-w-xs">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-3">Notifications</h3>
          <ul className="space-y-2">
            {notifications.length === 0 && (
              <p className="text-center text-gray-500">No new notifications</p>
            )}
            {notifications.map((notification, index) => (
              <li 
                key={index} 
                className={`p-3 rounded-lg transition-colors duration-200 ${
                  notification.readStatus ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 text-blue-700'
                }`}
              >
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : 'No timestamp'}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default Notifications;
