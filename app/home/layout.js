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
  const [anchorEl, setAnchorEl] = useState(null);
  const { isLoaded, isSignedIn, user } = useUser();
  const [stid, setstid] = useState(null);
  const [isprof,setisprof]=useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleNavAndClose = (e) => {
    handleMenuClose(); // Close menu logic
  };

  const gh=(e)=>{
    toast.success(`${e}`, {
      position: "top-right"
  });
  
    setIsModalOpen(false);
  }

   useEffect( () => {
    try {
      const email=user?.primaryEmailAddress?.emailAddress
   if (isLoaded && isSignedIn && user?.id) {
    const regex = /^[a-zA-Z0-9._%+-]+@mnnit\.ac\.in$/;
    setisprof(regex.test(email));
    }
    } catch (error) {
     console.log(error); 
    }
 },[user])
  
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
          {(isprof==1) ?
          <Link href="/home/Attendance" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300">
            Attendance
          </Link> :   <></>
          }
          
          {/* Menu Trigger Button */}
          <button
            onClick={handleMenuOpen}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Courses
          </button>
          
          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            
            <MenuItem onClick={handleNavAndClose}>
              <Link href="/home/AllCourses">All Courses</Link>
            </MenuItem>
          
            <MenuItem onClick={handleNavAndClose}>
              <Link href="/home/MyCourses">My Courses</Link>
            </MenuItem>
            {isprof  &&
            <MenuItem onClick={handleNavAndClose}>
              {/* <Link href="/home/AddCourses">Add Courses</Link> */}
              <button
        onClick={() => setIsModalOpen(true)}
      >
        Add Course
      </button>
            </MenuItem>
            } 
            
          </Menu>
          {
              isModalOpen && <Page isOpen={isModalOpen} onClose={(e)=>setIsModalOpen(false)}  gh={gh}/>
            }
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
      <main > {/* Add padding to avoid overlap with navbar */}
        {children }
        <ToastContainer /> {/* This is where the content of page.tsx will be rendered */}
      </main>
    </>
  );
}
