"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { toast } from 'react-toastify';
import { FaGalacticSenate } from 'react-icons/fa';
import { rgbToHex } from '@mui/material';

const Leaderboard = () => {
//   const { user } = useUser();
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);  
  
  let currentRank = 1; // Start rank at 1
  let previousPoints = null; // Track the previous student's points
  let displayRank = 1; // Displayed rank, updated only if points change
  
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
    
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#1f1f2e' }}>
      <table style={{ width: '80%', maxWidth: '800px', backgroundColor: '#2b2b3a', color: '#ffffff', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
              <tr>
                  <th style={{ padding: '12px', borderBottom: '2px solid #4CAF50', backgroundColor: '#33334d', color: '#4CAF50' }}>Rank</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #4CAF50', backgroundColor: '#33334d', color: '#4CAF50' }}>Avatar</th>
                  {/* <th style={{ padding: '12px', borderBottom: '2px solid #4CAF50', backgroundColor: '#33334d', color: '#4CAF50' }}>Name</th> */}
                  <th style={{ padding: '12px', borderBottom: '2px solid #4CAF50', backgroundColor: '#33334d', color: '#4CAF50' }}>Username</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #4CAF50', backgroundColor: '#33334d', color: '#4CAF50' }}>Points</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #4CAF50', backgroundColor: '#33334d', color: '#4CAF50' }}>Email</th>
              </tr>
          </thead>
          <tbody>
              {leaderboard.map((student, index) => {
                  if (student.points !== previousPoints) {
                      displayRank = currentRank;
                  }
                  previousPoints = student.points;
                  currentRank++;

                  return (
                      <tr key={student.clerkId} style={{ backgroundColor: index % 2 === 0 ? '#3b3b4f' : '#2b2b3a' }}>
                          <td style={{ padding: '12px', borderBottom: '1px solid #444' }}>{displayRank}</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #444' }}>
                              <img src={student.avatar} alt={`${student.firstName} ${student.lastName}`} className="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                          </td>
                          {/* <td style={{ padding: '12px', borderBottom: '1px solid #444' }}>{student.firstName} {student.lastName}</td> */}
                          <td style={{ padding: '12px', borderBottom: '1px solid #444' }}>{student.username}</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #444' }}>{student.points}</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #444' }}>{student.email}</td>
                      </tr>
                  );
              })}
          </tbody>
      </table>
  </div>

  );
};

export default Leaderboard;
