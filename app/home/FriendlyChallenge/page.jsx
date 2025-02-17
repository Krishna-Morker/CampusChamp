"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../../../components/Loader";

const FriendlyChallengePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (loading) return <Loader />;

  return (
    <div className="p-8 min-h-screen bg-gray-900 text-white">
      <div className="mb-8 text-center p-8">
        <h1 className="text-5xl font-bold text-blue-400 mb-4">Friendly Challenge</h1>
        <p className="text-lg text-gray-300">
          Challenge your friends by selecting a topic and opponent. We will handle the rest!
        </p>
        <p className="text-lg text-gray-300">Both players get 10 random questions on the chosen topic.</p>
        <p className="text-lg text-gray-300">Let's see who wins the challenge! 🎉</p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {/* Create Challenge Card */}
        <div className="p-6 bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 flex flex-col">
          <h2 className="text-3xl font-extrabold text-center text-blue-400 mb-5">Create Friendly Challenge</h2>
          <p className="text-lg text-gray-300 text-center italic flex-grow">
            Challenge your friends by creating a friendly challenge.
          </p>
          <button
            onClick={() => router.push(`/home/FriendlyChallenge/Create`)}
            className="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 rounded-md hover:shadow-lg transition duration-150"
          >
            Create
          </button>
        </div>

        {/* Pending Challenges Card */}
        <div className="p-6 bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 flex flex-col">
          <h2 className="text-3xl font-extrabold text-center text-yellow-400 mb-5">Pending Challenges</h2>
          <p className="text-lg text-gray-300 text-center italic flex-grow">
            See challenges that are pending acceptance or evaluation.
          </p>
          <button
            onClick={() => router.push(`/home/FriendlyChallenge/Pending`)}
            className="mt-6 w-full bg-gradient-to-r from-yellow-500 to-yellow-700 text-white py-2 rounded-md hover:shadow-lg transition duration-150"
          >
            View Pending
          </button>
        </div>

        {/* Completed Challenges Card */}
        <div className="p-6 bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 flex flex-col">
          <h2 className="text-3xl font-extrabold text-center text-green-400 mb-5">Completed Challenges</h2>
          <p className="text-lg text-gray-300 text-center italic flex-grow">
            Click below to see past challenge results.
          </p>
          <button
            onClick={() => router.push(`/home/FriendlyChallenge/Completed`)}
            className="mt-6 w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-2 rounded-md hover:shadow-lg transition duration-150"
          >
            View Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default FriendlyChallengePage;
