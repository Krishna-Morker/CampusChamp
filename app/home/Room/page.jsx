"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from 'next/navigation';
import Loader from '../../../components/Loader';

const AcceptedRoomsPage = () => {
  const [acceptedRooms, setAcceptedRooms] = useState([]);
  const [userd, setUserd] = useState(null);
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAcceptedRooms = async () => {
      try {
        const userId = user.id;
        const idResponse = await axios.post('/api/user', { id: userId });
        const fg = idResponse.data._id;
        setUserd(idResponse.data);

        // Fetch all rooms the user has joined
        const response = await axios.post("/api/study-room", { userId: fg, ge: "accepted" });
        setAcceptedRooms(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching accepted rooms:", error);
      }
    };
    
    fetchAcceptedRooms();
  }, [user]);

  // Handle leaving a room
  const handleLeaveRoom = async (roomId) => {
    try {
      await axios.post("/api/study-room", { roomId, userId: userd._id, ge:"leftroom" });
      console.log(`Left room with ID: ${roomId}`);
      
      // Update the acceptedRooms state to remove the room the user has left
      setAcceptedRooms((prevRooms) => prevRooms.filter((room) => room._id !== roomId));
    } catch (error) {
      console.error("Error leaving room:", error);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="m-5 p-6 bg-gray-100 rounded-lg max-w-[50%] mx-auto" style={{ backgroundColor: '#242527' }}>
      <h1 className="text-2xl text-white font-semibold mb-4 text-center">Your Accepted Rooms</h1>

      {acceptedRooms.length === 0 ? (
        <p className="text-white text-center">No rooms joined yet</p>
      ) : (
        acceptedRooms.map((room) => (
          <div key={room._id} className="text-white p-4 rounded-lg shadow mb-4" style={{ backgroundColor: '#31363f' }}>
            <h2 className="text-xl font-semibold">{room.roomName}</h2>
            <p className="text-white-600 mb-4">{room.roomDescription}</p>

            <div className="flex justify-between">
              <button
                onClick={() => router.push(`/group/${room._id}`)}
                className="bg-blue-600 text-white p-2 rounded-lg"
              >
                Join Room
              </button>
              <button
                onClick={() => handleLeaveRoom(room._id)}
                className="bg-red-600 text-white p-2 rounded-lg"
              >
                Leave Room
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AcceptedRoomsPage;
