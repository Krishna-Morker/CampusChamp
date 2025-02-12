"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

const CompletedFriendlyChallengePage = () => {
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
        const dbUser = await axios.post("/api/user", user.user);
        const userData = dbUser.data;

        const ge = "completed";
        const response = await axios.post("/api/friendlychallenge", {
          ge,
          userData,
        });

        const data = response.data;
        setChallenges(data);

        const filteredChallenger = data.filter(
          (item) => item.challengerId._id === userData._id
        );
        setChallenger(filteredChallenger);

        const filteredChallenged = data.filter(
          (item) => item.challengedId._id === userData._id
        );
        setChallenged(filteredChallenged);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchChallenges();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      <div className="mb-8 text-center p-8 font-semibold">
        <h1 className="text-4xl font-bold text-blue-400">Completed Challenges</h1>
      </div>

      {/* Challenger Challenges */}
      <div className="mb-10">
        <h1 className="text-3xl mb-4 text-blue-300">Challenger Challenges</h1>
        {challenger.length === 0 ? (
          <p className="text-gray-400">You have challenged no one.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-700 text-white rounded-lg">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="p-4 border border-gray-700">Topic</th>
                  <th className="p-4 border border-gray-700">Who You Challenged</th>
                  <th className="p-4 border border-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {challenger.map((challenge, index) => (
                  <tr key={index} className="hover:bg-gray-800">
                    <td className="p-4 border border-gray-700">{challenge.topic}</td>
                    <td className="p-4 border border-gray-700">{challenge.challengedId.email}</td>
                    <td className="p-4 border border-gray-700">
                      <button
                        onClick={() => router.push(`/home/FriendlyChallenge/Completed/${challenge._id}`)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-200"
                      >
                        View Result
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Challenged Challenges */}
      <div>
        <h1 className="text-3xl mb-4 text-blue-300">Challenged Challenges</h1>
        {challenged.length === 0 ? (
          <p className="text-gray-400">No one has challenged you.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-700 text-white rounded-lg">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="p-4 border border-gray-700">Topic</th>
                  <th className="p-4 border border-gray-700">Who Challenged You</th>
                  <th className="p-4 border border-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {challenged.map((challenge, index) => (
                  <tr key={index} className="hover:bg-gray-800">
                    <td className="p-4 border border-gray-700">{challenge.topic}</td>
                    <td className="p-4 border border-gray-700">{challenge.challengerId.email}</td>
                    <td className="p-4 border border-gray-700">
                      <button
                        onClick={() => router.push(`/home/FriendlyChallenge/Completed/${challenge._id}`)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-200"
                      >
                        View Result
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedFriendlyChallengePage;
