"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';

const PendingFriendlyChallengePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [challenges, setChallenges] = useState([]);
  const [challenged, setChallenged] = useState([]);
  const [challenger, setChallenger] = useState([]);
  const user = useUser();

  useEffect(() => {
    async function fetchChallenges() {
      setLoading(true);
      try {
        const dbUser = await axios.post('/api/user', user.user);
        const userData = dbUser.data;
        
        const ge = "pending";
        const response = await axios.post('/api/friendlychallenge', { ge, userData });
        const data = response.data;
        setChallenges(data);
        
        const filteredChallenger = data.filter(item => item.challengerId._id === userData._id);
        setChallenger(filteredChallenger);

        const filteredChallenged = data.filter(item => item.challengedId._id === userData._id);
        setChallenged(filteredChallenged);

      } catch (error) {
        console.error('Error fetching challenges:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchChallenges();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-200">Pending Challenges</h1>
      </div>
      
      {/* Challenger Challenges */}
      <div className="mb-12">
        <h2 className="text-3xl mb-4">Challenges You Created</h2>
        {challenger.length === 0 ? (
          <p className="text-lg text-gray-400">You have not challenged anyone yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {challenger.map((challenge, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-2">{challenge.topic}</h3>
                <p className="text-gray-400 mb-4">Challenged: {challenge.challengedId.email}</p>
                <button
                  onClick={() => router.push(`/home/FriendlyChallenge/Pending/${challenge._id}`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Take Challenge
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Challenged Challenges */}
      <div>
        <h2 className="text-3xl mb-4">Challenges You Received</h2>
        {challenged.length === 0 ? (
          <p className="text-lg text-gray-400">No one has challenged you yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {challenged.map((challenge, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-2">{challenge.topic}</h3>
                <p className="text-gray-400 mb-4">Challenged by: {challenge.challengerId.email}</p>
                <button
                  onClick={() => router.push(`/home/FriendlyChallenge/Pending/${challenge._id}`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Take Challenge
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingFriendlyChallengePage;
