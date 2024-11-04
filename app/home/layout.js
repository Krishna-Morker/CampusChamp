"use client";
import Page from '@/app/home/AddCourses/Page';
import { SignedIn, UserButton, useUser } from '@clerk/nextjs';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout({ children }) {
  const [anchorElCourses, setAnchorElCourses] = useState(null);
  const [anchorElChallenges, setAnchorElChallenges] = useState(null);
  const { isLoaded, isSignedIn, user } = useUser();
  const [isProf, setIsProf] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMenuOpen = (event, menu) => {
    if (menu === 'courses') {
      setAnchorElCourses(event.currentTarget);
    } else if (menu === 'Challenges') {
      setAnchorElChallenges(event.currentTarget);
    }
  };

  const handleMenuClose = () => {
    setAnchorElCourses(null);
    setAnchorElChallenges(null);
  };

  const showToast = (message) => {
    toast.success(message, {
      position: "top-right",
    });
    setIsModalOpen(false);
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
      <nav className="w-full py-6 px-8 flex justify-between items-center bg-opacity-80 bg-gray-900 top-0 z-50 shadow-dark-custom">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">
          Campus Champ
        </h1>
        <div className="space-x-4">
          <Link href="/home" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300">
            Home
          </Link>
          {isProf && (
            <Link href="/home/Attendance" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300">
              Attendance
            </Link>
          )}

          {/* Courses Menu Trigger */}
          <button
            onClick={(e) => handleMenuOpen(e, 'courses')}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
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
              <MenuItem onClick={() => setIsModalOpen(true)}>
                Add Course
              </MenuItem>
            )}
          </Menu>

          {/* Job Portal Menu Trigger */}
          <button
            onClick={(e) => handleMenuOpen(e, 'Challenges')}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Challenges
          </button>
          <Menu
            anchorEl={anchorElChallenges}
            open={Boolean(anchorElChallenges)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <Link href="/home/daily-challenges">Daily Challenges</Link>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Link href="/job-portal/post">Weekly challenges</Link>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Link href="/job-portal/my-posted-jobs">Monthly Challenges</Link>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Link href="/job-portal/my-applied-jobs">Friendly Challenges</Link>
            </MenuItem>
          </Menu>

          {isModalOpen && (
            <Page isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} gh={showToast} />
          )}
          
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
