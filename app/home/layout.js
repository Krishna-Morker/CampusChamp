"use client";
import Page from '@/app/home/AddCourses/Page';
import { SignedIn, UserButton, useUser } from '@clerk/nextjs';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Notification from '@/components/Notification';
import axios from 'axios';
import CreateRoom from '@/app/home/Room/Addroom/page'

export default function Layout({ children }) {
  const [anchorElCourses, setAnchorElCourses] = useState(null);
  const [anchorElChallenges, setAnchorElChallenges] = useState(null);
  const [anchorElRooms, setAnchorElRooms] = useState(null);
  const { isLoaded, isSignedIn, user } = useUser();
  const [isProf, setIsProf] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenRoom,setisModalOpenRoom]= useState(false);

  const handleMenuOpen = (event, menu) => {
    if (menu === 'courses') {
      setAnchorElCourses(event.currentTarget);
    } else if (menu === 'Challenges') {
      setAnchorElChallenges(event.currentTarget);
    }else if(menu === 'Room'){
      setAnchorElRooms(event.currentTarget);
    }
  };

  const handleMenuClose = () => {
    setAnchorElCourses(null);
    setAnchorElRooms(null);
    setAnchorElChallenges(null);
  };
  
  const handle = () => {
    setAnchorElCourses(null);
    setAnchorElChallenges(null);
    setAnchorElRooms(null);
    setIsModalOpen(true);
  };
  const handle1 = () => {
    setAnchorElCourses(null);
    setAnchorElChallenges(null);
    setAnchorElRooms(null);
    setisModalOpenRoom(true);
  };

  const showToast = (message) => {
    toast.success(message, {
      position: "top-right",
    });
    setIsModalOpen(false);
  };
  const showToast1 = (message) => {
    toast.success(message, {
      position: "top-right",
    });
    setisModalOpenRoom(false);
  };

  useEffect(() => {
    if (isLoaded && isSignedIn && user?.id) {
      const email = user?.primaryEmailAddress?.emailAddress;
      const regex = /^[a-zA-Z0-9._%+-]+@mnnit\.ac\.in$/;
      setIsProf(regex.test(email));
    }
  }, [user, isLoaded, isSignedIn]);

  return (
    <>
      <nav className="w-full py-4 px-8 flex justify-between items-center shadow-lg text-white"
      style={{ backgroundColor: '#171a1f' }}>
        <h1 className="text-3xl font-extrabold">
          Campus Champ
        </h1>
     
        <div className="flex items-center space-x-6">
          <Link href="/home"  className="bg-transparent text-white rounded-md hover:bg-white hover:text-blue-600 transition duration-300">
            Home
          </Link>
          <Link href="/home/Leaderboard"  className="bg-transparent text-white rounded-md hover:bg-white hover:text-blue-600 transition duration-300">
            Leaderboard
          </Link>
          <Link href="/home/Activity"  className="bg-transparent text-white rounded-md hover:bg-white hover:text-blue-600 transition duration-300">
          See Activity
          </Link>
          <Link href="/home/WeeklyTimeTable"  className="bg-transparent text-white rounded-md hover:bg-white hover:text-blue-600 transition duration-300">
          Timetable
          </Link>
          {isProf && (
            <Link href="/home/Attendance"  className="bg-transparent text-white rounded-md hover:bg-white hover:text-blue-600 transition duration-300">
              Attendance
            </Link>
          )}

          {!isProf && (
            <Link href="/home/StudentAttendance"  className="bg-transparent text-white rounded-md hover:bg-white hover:text-blue-600 transition duration-300">
              Attendance
            </Link>
          )}
          {isProf && (
            <Link href="/home/Quiz"  className="bg-transparent text-white rounded-md hover:bg-white hover:text-blue-600 transition duration-300">
              Quiz
            </Link>
          )}

          {!isProf && (
            <Link href="/home/StudentQuiz"  className="bg-transparent text-white rounded-md hover:bg-white hover:text-blue-600 transition duration-300">
              Quiz
            </Link>
          )}
          
          {/* Menu Trigger Button */}
          <button
            onClick={(e) => handleMenuOpen(e, 'courses')}
            className="bg-transparent text-white rounded-md hover:bg-white hover:text-blue-600 transition duration-300"
          >
            Courses
          </button>
          <Menu
            anchorEl={anchorElCourses}
            open={Boolean(anchorElCourses)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <Link href="/home/AllCourses">All Courses</Link>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Link href="/home/MyCourses">My Courses</Link>
            </MenuItem>
            {isProf && (
              <MenuItem onClick={handle}>
                Add Course
              </MenuItem>
            )}
          </Menu>
          <button
            onClick={(e) => handleMenuOpen(e, 'Room')}
            className="bg-transparent text-white rounded-md hover:bg-white hover:text-blue-600 transition duration-300"
          >
            Room
          </button>
          <Menu
            anchorEl={anchorElRooms}
            open={Boolean(anchorElRooms)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
            <Link href="/home/Room/Solo">Solo Room</Link>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
            <Link href="/home/Room">Join Room</Link>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
            <Link href="/home/Room/Request">Request</Link>
            </MenuItem>
            <MenuItem onClick={handle1}>
             Create Room
            </MenuItem>
          </Menu>
          {/* Challenges Menu Trigger */}
          <button
            onClick={(e) => handleMenuOpen(e, 'Challenges')}
            className="bg-transparent text-white rounded-md hover:bg-white hover:text-blue-600 transition duration-300"
          >
            Challenges
          </button>
          <Menu
            anchorEl={anchorElChallenges}
            open={Boolean(anchorElChallenges)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <Link href={{ pathname: '/home/daily-challenges', query: { type: 'daily' } }}>Daily Challenges</Link>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Link href={{ pathname: '/home/daily-challenges', query: { type: 'weekly' } }}>Weekly Challenges</Link>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Link href={{ pathname: '/home/daily-challenges', query: { type: 'monthly' } }}>Monthly Challenges</Link>
            </MenuItem>
          </Menu>
            
          {isModalOpen && (
            <Page isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} gh={showToast} />
          )}
          {isModalOpenRoom && (
            <CreateRoom isOpen={isModalOpenRoom} onClose={() => setisModalOpenRoom(false)} gh={showToast1} />
          )}

          
          {!isProf && (
            <Link href="/home/FriendlyChallenge"  className="bg-transparent text-white rounded-md hover:bg-white hover:text-blue-600 transition duration-300">
              Friendly Challenge
            </Link>
          )}
        
             <Notification/>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
      <main>
        {children}
        <ToastContainer />
      </main>
    </>
  );
}