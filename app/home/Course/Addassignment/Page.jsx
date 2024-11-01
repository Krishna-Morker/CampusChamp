"use client";
import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid'; // For the close icon
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { useEdgeStore } from '@/lib/edgestore';
import { toast } from 'react-toastify';

const Page = ({ isOpen, onClose ,courseId}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const {edgestore} = useEdgeStore();
  const [urls,setUrls]=useState(null)
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
    const data={
        courseId,
        title,
        description,
        dueDate,
        urls
    }
    const res=await axios.post('/api/assignment',data)
    toast.success("Assignment added successfully");
      onClose(); // Close the modal after successful submission
    } catch (error) {
      console.error('Error uploading assignment:', error);
      alert("Failed to upload assignment");
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
             onClick={async()=>{
                if(file){
                  const res=await edgestore.myProtectedFiles.upload({file});
                  setUrls(res.url)
                }
              }}
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150"
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
