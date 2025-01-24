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
        const dbUser = await axios.post('/api/user',user.user);
        const userData = dbUser.data;
        // console.log(dbUser);
        
        const ge="pending";
        const response = await axios.post('/api/friendlychallenge',{ ge , userData });
        // console.log(response);

        const data = response.data;
        setChallenges(data);

        console.log(data,userData);
        
        const filteredChallenger = data.filter(item => item.challengerId === userData._id);
        console.log(filteredChallenger);
        setChallenger(filteredChallenger);

        const filteredChallenged = data.filter(item => item.challengedId === userData._id);
        console.log(filteredChallenged);
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
    <div className="p-8 min-h-screen"
    style={{ backgroundColor: '#242527' }}>
      <div className="mb-8 text-center p-8 text-semibold">
        <h1 className='text-4xl'>Pending Challenges</h1>
      </div>
        <div>
          <h1 className='text-4xl'>Challenger Challenges</h1>
          {challenger.length===0 ? (<p>No Pending Challenges</p>) : (
            <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-3">
                  
            </div>
          )}
        </div>
    </div>
  );
};

export default PendingFriendlyChallengePage;
