"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../../components/Loader';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/leaderboard');
      setLeaderboard(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load leaderboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;

  return (
    <div className="flex justify-center items-start pt-8 h-screen bg-gray-900"
    style={{ backgroundColor: '#242527' }}>
      <table className="w-11/12 md:w-3/4 lg:w-2/3 max-w-4xl bg-gray-800 text-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-700">
            <th className="py-3 px-4 border-b-2 border-green-500 text-green-400">Rank</th>
            <th className="py-3 px-4 border-b-2 border-green-500 text-green-400">Avatar</th>
            <th className="py-3 px-4 border-b-2 border-green-500 text-green-400">Username</th>
            <th className="py-3 px-4 border-b-2 border-green-500 text-green-400">Points</th>
            <th className="py-3 px-4 border-b-2 border-green-500 text-green-400">Email</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((student, index) => {
            const isEvenRow = index % 2 === 0;
            const rowBgColor = isEvenRow ? 'bg-gray-800' : 'bg-gray-700';
            const rank = index + 1;

            return (
              <tr key={student.clerkId} className={`${rowBgColor} hover:bg-gray-600`}>
                <td className="py-3 px-4 border-b border-gray-600 text-center">{rank}</td>
                <td className="py-3 px-4 border-b border-gray-600 flex justify-center">
                  <img src={student.avatar} alt={student.username} className="w-10 h-10 rounded-full" />
                </td>
                <td className="py-3 px-4 border-b border-gray-600">{student.username || (student.firstName+" "+student.lastName)}</td>
                <td className="py-3 px-4 border-b border-gray-600 text-center">{student.points}</td>
                <td className="py-3 px-4 border-b border-gray-600">{student.email}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
