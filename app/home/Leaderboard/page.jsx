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
            
            // console.log(result);

            if (result.success) {
                setLeaderboard(result.data);
            } else {
                throw new Error(result.message || 'Failed to fetch leaderboard');
            }
        } catch (err) {
            setError(err.message);
        }
    }

  // Fetch courses from the backend
  useEffect(() => {

    fetchLeaderboard();
  }, []);

  return (
    <>
        <div>
            <h1>All Users</h1>
            
        </div>
    </>
  );
};

export default Leaderboard;
