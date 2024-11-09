"use client";
import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid'; // For the close icon
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { useEdgeStore } from '@/lib/edgestore';
import { toast } from 'react-toastify';
import { fileURLToPath } from 'url';

const Page = ({ isOpen, onClose ,courseId}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [progress,setprogress]=useState(0);
  const {edgestore} = useEdgeStore();
  const [urls,setUrls]=useState(null)
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    let fileURL;
    setLoading(true);
    if (file) {
      // Upload the file and update progress
      const uploadResponse = await edgestore.myProtectedFiles.upload({
        file,
        onProgressChange: (progress) => {
          setprogress(progress);
        },
      });

      setUrls(uploadResponse.url);
      
      //console.log(uploadResponse.url)
      fileURL=uploadResponse.url
      //console.log(urls)
    }
    
    const ge="addass"
  //  console.log(urls);
    try {
    const data={
        courseId:courseId,
        title:title,
        description:description,
        dueDate:dueDate,
        urls:fileURL,
        ge
    }
  
    
    const res=await axios.post('/api/assignment',data)
    toast.success("Assignment added successfully");
      onClose(); // Close the modal after successful submission
    } catch (error) {
      console.error('Error uploading assignment:', error);
      toast.error("Failed to upload assignment");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="relative bg-white p-8 rounded-xl shadow-lg w-full max-w-lg transform transition-all duration-300 scale-105">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition duration-150">
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 border-blue-500">
          Upload Assignment
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-gray-700 font-semibold mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-gray-900 p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-150"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-gray-900 p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-150"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 font-semibold mb-2">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-3 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-150"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 font-semibold mb-2">File</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-3 text-gray-900 border border-gray-300 rounded-md focus:outline-none"
              required
            />
             <div className="h-[6px] w-full border rounded overflow-hidden">
              <div
              className="h-full bg-gray-900 transition-all duration-150"
              style={{
                width:`${progress}%`
              }}
              >
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-150"
            >
              Cancel
            </button>
           
            
            <button
            className="bg-gray-500 test-gray rounded px-2 hover:opacity-80"
              type="submit"
            >
              {loading ? 'Loading...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
