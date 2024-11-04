"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '@/components/Loader';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      const response = await axios.get('/api/leaderboard');
      setLeaderboard(response.data); // Update leaderboard data
      setError(null); // Clear any previous error
    } catch (err) {
      setError("Failed to load leaderboard data. Please try again later.");
    } finally {
      setLoading(false); // Always stop loading when done
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#1f1f2e' }}>
      <table style={{ width: '80%', maxWidth: '800px', backgroundColor: '#2b2b3a', color: '#ffffff', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '12px', borderBottom: '2px solid #4CAF50', backgroundColor: '#33334d', color: '#4CAF50' }}>Rank</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #4CAF50', backgroundColor: '#33334d', color: '#4CAF50' }}>Avatar</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #4CAF50', backgroundColor: '#33334d', color: '#4CAF50' }}>Username</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #4CAF50', backgroundColor: '#33334d', color: '#4CAF50' }}>Points</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #4CAF50', backgroundColor: '#33334d', color: '#4CAF50' }}>Email</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((student, index) => {
            const isEvenRow = index % 2 === 0;
            const backgroundColor = isEvenRow ? '#3b3b4f' : '#2b2b3a';
            const rank = index + 1;

            return (
              <tr key={student.clerkId} style={{ backgroundColor }}>
                <td style={{ padding: '12px', borderBottom: '1px solid #444' }}>{rank}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #444' }}>
                  <img src={student.avatar} alt={`${student.username}`} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                </td>
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
