"use client";
import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid'; // For the close icon
import axios from 'axios';


const CourseModal = ({ isOpen, onClose,gh }) => {
  const [courseName, setCourseName] = useState('');
  const [professorName, setProfessorName] = useState('');
  const [joinCode, setJoinCode] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    try {
      const response = await axios.post('/api/course', { courseName, professorName, joinCode });
      const mes = response.data; // Assuming your server returns a message
      gh(mes); // Close the modal after successful submission
      // Optionally, reset the form fields after submission
    } catch (error) {
      console.error('Error in Creating Course:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="relative bg-white p-8 rounded-xl shadow-lg w-full max-w-lg transform transition-all duration-300 scale-105">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition duration-150">
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Modal Title */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 border-blue-500">
          Add Course
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-gray-700 font-semibold mb-2">Course Name:</label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full text-gray-900 p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-150"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 font-semibold mb-2">Professor Name:</label>
            <input
              type="text"
              value={professorName}
              onChange={(e) => setProfessorName(e.target.value)}
              className="w-full text-gray-900 p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-150"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 font-semibold mb-2">Join Code:</label>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="w-full p-3 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-150"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-150"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseModal;
