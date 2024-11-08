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
  const [isPopoverOpen, setIsPopoverOpen] = useState(false); // State to control popover visibility


  // Fetch courses and notifications from the backend
  const fetchCoursesAndNotifications = async () => {
    try {
      const response = await axios.post('/api/user', { id: user.id });
      const userData = response.data;
      setProfessorCourses(userData.Courses || []);
      setUse(userData);
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
    const channel1 = pusher.subscribe(`room-${use._id}`);
    channel1.bind('room-created', (data) => {
      toast.success(data.message);
      fetchCoursesAndNotifications();
    });
    professorCourses.forEach(courseId => {
      const channel = pusher.subscribe(`course-${courseId}-notifications`);
      subscribedChannels.push(channel);
      if (use?.prof === 1) {
        channel.bind('student-joined', (data) => {
          toast.success(data.message);
          fetchCoursesAndNotifications();
        });
      } else {
        channel.bind('assignment-created', (data) => {
          toast.success(data.message);
          fetchCoursesAndNotifications();
        });
      }
    });

    return () => {
      subscribedChannels.forEach(channel => {
        channel.unbind_all();
        channel.unsubscribe();
      });
      pusher.disconnect();
    };
  }, [professorCourses, user]);

  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.readStatus).length;

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

  // Handle popover open/close event
  const handlePopoverChange = (isOpen) => {
    setIsPopoverOpen(isOpen);
    if (!isOpen) {
      // Automatically mark all as read when the popover is closed
      markAllAsRead();
    }
  };

  return (
    <Popover onOpenChange={handlePopoverChange}>
      <PopoverTrigger className="relative flex items-center justify-center rounded-lg">
        <Image 
          src="/bell.svg"
          alt="Notifications"
          width={24}
          height={24}
          className="hover:scale-110 transition-transform duration-150"
        />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </PopoverTrigger>

      {isPopoverOpen && (
        <PopoverContent align="end" className="bg-white border border-gray-200 shadow-lg rounded-lg max-w-xs">
          <div className="relative p-4">
            {/* Close Button for the Popover */}
            <button
              onClick={() => setIsPopoverOpen(false)}  // Close on click
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <h3 className="text-lg text-gray-800 font-semibold mb-3">Notifications</h3>
            <ul className="space-y-2 text-gray-800 max-h-[50vh] overflow-y-auto">
              {notifications.length === 0 && (
                <p className="text-center text-gray-800">No new notifications</p>
              )}
              {notifications.map((notification) => (
                <div key={notification._id} className="max-h-[50vh] overflow-y-auto mr-4v mb-2">
                  <li
                    className={`p-3 rounded-lg transition-colors duration-200 ${
                      notification.readStatus ? 'bg-gray-100 text-gray-500' : 'bg-blue-200 text-blue-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-700">{notification.message}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : 'No timestamp'}
                    </p>
                  </li>
                </div>
              ))}
            </ul>
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
}

export default Notifications;
