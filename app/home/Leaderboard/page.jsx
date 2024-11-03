"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { toast } from 'react-toastify';
import { FaGalacticSenate } from 'react-icons/fa';

const Leaderboard = () => {
//   const { user } = useUser();
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);   
  
    const fetchLeaderboard = async () => {
        try {
            const response = await axios.get('/api/leaderboard');
            const result = response.data;
            
            console.log(result);

            setLeaderboard(result);
        } catch (err) {
            setError(err.message);
        }
    }

  // Fetch courses from the backend
  useEffect(() => {

    fetchLeaderboard();
  }, []);

  return (
    
    <div className="bg-gradient-to-b from-gray-600 to-gray-50 py-8 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Student Leaderboard</h1>

        {leaderboard.length === 0 ? (
          <p className="text-center text-gray-600">No student data available.</p>
        ) : (
          <div className="space-y-4">
            {leaderboard.map((student) => (
              <div
                key={student._id}
                className="flex items-center p-4 border border-gray-300 rounded-md shadow-sm transition-transform transform hover:scale-105"
              >
                <img
                  src={student.avatar}
                  alt={`${student.username}'s avatar`}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div className="flex-grow">
                  <h2 className="text-lg font-medium text-gray-700">{student.username}</h2>
                  <p className="text-gray-600 mb-1">Email: {student.email}</p>
                  <p className="text-gray-600 mb-1">Aura Points: {student.points}</p>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>

  );
};

export default Leaderboard;
