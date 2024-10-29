// pages/IntroPage.js
import React from 'react';
import { FaStar, FaTrophy, FaTasks } from 'react-icons/fa';

const IntroPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-black text-white">
    

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center pt-24 px-6">
        <div className="text-center max-w-2xl mt-10">
          <h1 className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 animate-pulse">
            Welcome to Campus Champ!
          </h1>
          <p className="text-lg sm:text-xl font-medium mb-10 leading-relaxed text-gray-300">
            Earn points by participating in campus events, completing assignments, and engaging in friendly competition.
            Track your progress, rank up, and challenge your friends on the leaderboard!
          </p>

          <div className="flex justify-around items-center mb-10 gap-8">
            {/* Icons with animation */}
            <div className="flex flex-col items-center transform hover:scale-110 transition duration-300">
              <FaStar className="text-yellow-400 text-6xl mb-2 animate-bounce" />
              <p className="text-sm font-semibold">Participate & Earn</p>
            </div>
            <div className="flex flex-col items-center transform hover:scale-110 transition duration-300">
              <FaTasks className="text-green-400 text-6xl mb-2 animate-bounce delay-100" />
              <p className="text-sm font-semibold">Complete Tasks</p>
            </div>
            <div className="flex flex-col items-center transform hover:scale-110 transition duration-300">
              <FaTrophy className="text-yellow-500 text-6xl mb-2 animate-bounce delay-200" />
              <p className="text-sm font-semibold">Achieve & Compete</p>
            </div>
          </div>

          <button className="mt-6 bg-gradient-to-r from-yellow-400 to-pink-500 text-white font-semibold py-3 px-8 rounded-full hover:from-pink-500 hover:to-yellow-400 transition duration-500 ease-in-out transform hover:scale-105">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;
