"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';

const FriendlyChallengePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  
  if (loading) return <Loader />;

  return (
    <div className="p-8 min-h-screen"
    style={{ backgroundColor: '#242527' }}>
      <div className="mb-8 text-center p-8 text-semibold">
        <h1 className='text-4xl'>Friendly Challenge</h1>
        <p>Here you can challenge any of your buddy, you need to just select the topic on which you want to challenge and the person whom you want to challenge.</p>
        <p>Rest of the things would be taken care by us.</p>
        <p>Random 10 questions would be given to both of you based on the yopic selected.</p>
        <p>Let's see who wins the challenge!!</p>
      </div>
        <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-3">
              <div
              className="p-8 rounded-xl shadow-2xl transition-transform transform hover:scale-105 hover:shadow-2xl flex flex-col"
              style={{  backgroundColor: '#31363f'}}>
             
              <h2 className="text-3xl font-extrabold text-center text-white-950 mb-7">Create Friendly Challenge</h2>
              <div className="text-center flex-grow">
                <p className="text-1xl font-normal text-white-900 leading-relaxed italic p-4">
                You can challenge any of your friends by creating a friendly challenge.
                </p>
            </div>
              <button
                onClick={() => router.push(`/home/FriendlyChallenge/Create`)}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-150"
              >
                Create
              </button>
            </div>

            <div
              className="p-8 rounded-xl shadow-2xl transition-transform transform hover:scale-105 hover:shadow-2xl flex flex-col"
              style={{  backgroundColor: '#31363f'}}>
             
              <h2 className="text-3xl font-extrabold text-center text-white-950 mb-7">Pending Challenges</h2>
              <div className="text-center flex-grow">
                <p className="text-1xl font-normal text-white-900 leading-relaxed italic p-4">
                Pending challenges are shown here, either opponent has not accepted your challenge yet or the evaluation is not completed yet.
                </p>
            </div>
              <button
                onClick={() => router.push(`/home/FriendlyChallenge/Pending`)}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-150"
              >
                Pending
              </button>
            </div>

            <div
              className="p-8 rounded-xl shadow-2xl transition-transform transform hover:scale-105 hover:shadow-2xl flex flex-col"
              style={{  backgroundColor: '#31363f'}}>
             
              <h2 className="text-3xl font-extrabold text-center text-white-950 mb-7">Completed Challenges</h2>
              <div className="text-center flex-grow">
                <p className="text-1xl font-normal text-white-900 leading-relaxed italic p-4">
                Click below to see the results of the past friendly challenges.
                </p>
            </div>
              <button
                onClick={() => router.push(`/home/FriendlyChallenge/Completed`)}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-150"
              >
                Completed
              </button>
            </div>
        </div>
    </div>
  );
};

export default FriendlyChallengePage;