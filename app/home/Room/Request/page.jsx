"use client";
import { useState, useEffect } from "react";
import { useUser } from '@clerk/nextjs';
import axios from "axios";

const Request = () => {
  const { user } = useUser();
  const [userd, setUserd] = useState(null);
  const [allRequest, setAllRequest] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let p = user.id;
        let id = await axios.post('/api/user', { id: p });
        const fg = id.data._id;
        setUserd(id.data);
        const response = await axios.post("/api/study-room", { fg, ge: "request" });
        setAllRequest(response.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    fetchUsers();
  }, [user]);

  // Function to handle accept request
  const handleAccept = async (roomId) => {
    try {
      const response = await axios.post("/api/study-room", { roomId, userId: userd._id, ge: "accept" });
      console.log("Request accepted:", response.data);

      // Remove the accepted request from the UI
      setAllRequest((prevRequests) => prevRequests.filter((request) => request._id !== roomId));
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  // Function to handle reject request
  const handleReject = async (roomId) => {
    try {
      const response = await axios.post("/api/study-room", { roomId, userId: userd._id, ge: "reject" });
      console.log("Request rejected:", response.data);

      // Remove the rejected request from the UI
      setAllRequest((prevRequests) => prevRequests.filter((request) => request._id !== roomId));
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen flex flex-col items-center"
    style={{ backgroundColor: '#242527' }}>
      <h1 className="text-3xl font-bold text-white-800 mb-6">Pending Invitations</h1>

      {allRequest.length === 0 ? (
        <p className="text-xl text-white-600">No pending invitations</p>
      ) : (
        allRequest.map((request) => (
          <div key={request._id} className="p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 mb-6 w-full max-w-xl"
          style={{  backgroundColor: '#31363f'}}>
            <h2 className="text-2xl font-semibold text-white-800 mb-2">{request.roomName}</h2>
            <p className="text-lg text-white-600 mb-4">{request.roomDescription}</p>

            <div className="flex justify-between items-center">
              <button
                onClick={() => handleAccept(request._id)}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg text-lg font-semibold hover:bg-blue-700 focus:outline-none transition duration-200"
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(request._id)}
                className="bg-red-600 text-white py-2 px-4 rounded-lg text-lg font-semibold hover:bg-red-700 focus:outline-none transition duration-200"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Request;
