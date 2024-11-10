"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from '@clerk/nextjs'; 
import axios from 'axios';
import Loader from '@/components/Loader';
import Notification from '@/components/Notification';

export default function Page() {
  const [points, setPoints] = useState(0);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [use, setUser] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        let p = user.id;
        let idResponse = await axios.post('/api/user', { id: p });
        const userId = idResponse.data._id;
        setPoints(idResponse.data.points);
        setUser(idResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
   if(user) fetchCourses();
  }, [user]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 font-sans">
      {/* Welcome Section */}
      <header className="p-12 text-center bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <h1 className="text-5xl font-extrabold mb-4 animate-fadeIn">Welcome to Campus Champ!</h1>
        <p className="mt-4 text-lg font-medium opacity-90">
          Empowering students and professors with assignments, challenges, real-time notifications, and collaborative study.
        </p>
        {use?.prof === 1 ? null : (
          <>
            <h2 className="mt-6 text-2xl font-bold">Your Points</h2>
            <div className="mt-2 inline-block bg-white text-indigo-600 font-semibold px-8 py-3 rounded-full shadow-xl hover:shadow-2xl hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105">
              {points}
            </div>
          </>
        )}
      </header>

      {/* Key Features Overview */}
      <main className="px-8 py-12 space-y-16">
        <section className="text-center">
          <h2 className="text-4xl font-semibold text-indigo-800 mb-10 animate-slideUp">Explore Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Feature Cards */}
            {[
              { title: "Assignments", color: "indigo", text: "Upload and review assignments and earn points." },
              { title: "Challenges", color: "indigo", text: "Participate in daily, weekly, and monthly challenges." },
              { title: "Attendance", color: "indigo", text: "Track attendance records and manage course sessions." },
              { title: "Study Rooms", color: "indigo", text: "Join study rooms for collaborative learning and discussions." },
            ].map((feature, index) => (
              <div
                key={index}
                className={`p-8 bg-white rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 hover:bg-${feature.color}-50 border-b-4 border-${feature.color}-600`}
              >
                <h3 className={`text-2xl font-bold text-${feature.color}-600`}>{feature.title}</h3>
                <p className="mt-3 text-gray-700 text-lg">{feature.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Real-Time Notifications Section */}
        <section className="text-center py-16 bg-gray-100 rounded-xl shadow-inner relative">
          <h2 className="text-3xl font-semibold text-indigo-800 mb-4">Stay Updated in Real-Time</h2>
          <p className="text-lg text-gray-700 max-w-xl mx-auto mb-8">
            Get instant notifications about new assignments, course updates, and group study sessions, ensuring you never miss out.
          </p>
          <div className="relative inline-block">
            <img src="/bell.svg" alt="Real-time notifications icon" className="w-16 mx-auto mb-4" />
            <div className="absolute -top-1 -right-3 w-4 h-4 bg-red-600 rounded-full animate-ping"></div>
          </div>
        </section>

        {/* Leaderboard Section */}
        <section className="text-center">
          <h2 className="text-3xl font-semibold text-indigo-800 mb-8">Climb the Leaderboard</h2>
          <p className="text-lg text-gray-700 mb-12 max-w-lg mx-auto">
            Complete assignments, participate in challenges, and track your progress to see where you rank among your peers.
          </p>
          <Link href="/home/Leaderboard">
            <button className="bg-yellow-500 text-white font-semibold px-8 py-3 rounded-full shadow-md hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105">
              View Leaderboard
            </button>
          </Link>
        </section>
      </main>

      {/* Motivational Footer */}
      <footer className="text-center py-8 bg-gradient-to-r from-purple-700 to-indigo-700 text-white">
        <p className="text-xl font-medium">Keep up the momentum and stay engaged. Your journey to success starts here!</p>
      </footer>
    </div>
  );
}
