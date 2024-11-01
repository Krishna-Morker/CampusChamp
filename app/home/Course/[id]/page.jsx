"use client"
import { use,useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Loader from '@/components/Loader';
import Page from '@/app/home/Course/Addassignment/Page';
import { toast } from 'react-toastify';
import Link from 'next/link';


const AssignmentsPage = ({params}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseId, setCourseId] = useState(null);
  const { id } = use(params);
  useEffect(() => {
    setCourseId(id);
  }, [id]);

  // Fetch assignments
  const isOpen=()=>{
    setIsModalOpen(true);
  }
  
  const onClose=()=>{
    setIsModalOpen(false);
  }
  const onUploadSuccess = (message) => {
    // Handle success, e.g., show a toast message
    toast.success(message);
    onClose();
  };

  return (
    <>
     <button onClick={isOpen}></button>
     {isModalOpen &&
     <Page isOpen={isOpen} onClose={onClose} courseId={courseId}/>}
    </>
  );
};

export default AssignmentsPage;
