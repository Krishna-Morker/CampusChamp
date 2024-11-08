"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import Pusher from 'pusher-js';
import {use, useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";

const RoomPage = ({ params }) => {
  const { user } = useUser();
  const [roomData, setRoomData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [timer, setTimer] = useState(0); // Timer state
  const [inputTime, setInputTime] = useState(""); // Separate state for input field
  const [channel, setChannel] = useState(null);
  const { roomId } = use(params);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (!roomId || !user) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const newChannel = pusher.subscribe(`room-${roomId}`);
    setChannel(newChannel);

    newChannel.bind('new-message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    newChannel.bind('start-timer', (data) => {
      setTimer(data.duration); // Sync timer with other users
    });


    // Cleanup on component unmount
    return () => {
      newChannel.unbind_all();
      newChannel.unsubscribe();
      pusher.disconnect();
    };
  }, [roomId, user]);

  useEffect(() => {
    if (!roomId) return;

    const fetchTimer = async () => {
      try {
        const { data } = await axios.post(`/api/timer`, { roomId, ge: "gettimer" });
        setTimer(data); // Set timer to remaining time
      } catch (error) {
        console.error("Error fetching timer:", error);
      }
    };

    fetchTimer();
  }, [roomId, user]);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const roomRes = await axios.post(`/api/study-room`, { ge: "getroom", roomId });
        setRoomData(roomRes.data);
        setParticipants(roomRes.data.participants);
        setTasks(roomRes.data.tasks);

        const messagesRes = await axios.post(`/api/message`, { roomId, ge: "getmessage" });
        setMessages(messagesRes.data);
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchRoomData();
  }, [roomId, user.id]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval); // Clear interval on unmount
    }
  }, [timer]);

  const handleStartTimer = async () => {
    const duration = parseInt(inputTime);
    if (isNaN(duration) || duration <= 0) {
      toast.error("Please enter a valid duration in seconds.");
      return;
    }

    setTimer(duration); // Start the timer
    setInputTime(""); // Clear input field

    await axios.post('/api/timer', {
      roomId,
      duration,
      ge: "timer",
    });
   /// toast.success(`Timer started for ${duration} seconds`);
  };

  const handleSendMessage = async (e) => {
    if (e.key === "Enter" && newMessage.trim()) {
      const mess = {
        username: user.username,
        message: newMessage,
      };
      setNewMessage("");

      try {
        await axios.post("/api/message", { roomId, ge: "message", mess });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleLeaveRoom = async () => {
    try {
      if (channel) {
        channel.unbind_all();
        channel.unsubscribe();
        toast.success("You have left the room.");
      }
    } catch (error) {
      console.error("Error leaving room:", error);
      toast.error("Failed to leave the room.");
    }
  };

  // Scroll to latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="p-8 bg-gray-900 text-white rounded-lg max-w-4xl mx-auto">
      {/* Room Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{roomData?.roomName}</h1>
        <p className="text-gray-300">{roomData?.roomDescription}</p>
        <button
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded mt-4"
          onClick={handleLeaveRoom}
        >
          Leave Room
        </button>
      </div>

      {/* Participants Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Participants</h2>
        <div className="flex flex-wrap gap-4">
          {participants.map((participant) => (
            <div key={participant._id} className="flex items-center gap-2 bg-gray-800 p-3 rounded-lg shadow">
              <div className="w-8 h-8 bg-green-400 rounded-full">
                <img src={participant.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
              </div>
              <span>{participant.username}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Box */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Room Chat</h2>
        <div ref={chatContainerRef} className="bg-gray-800 p-4 rounded-lg h-64 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div key={idx} className="mb-2">
              <strong>{msg.username}</strong>: <span className="text-white-300">{msg.message}</span>
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full mt-4 p-2 rounded bg-gray-700 text-white"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleSendMessage}
        />
      </div>

      {/* Task/Assignment Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Tasks & Assignments</h2>
        <ul>
          {tasks?.map((task) => (
            <li key={task.id} className="bg-gray-800 p-4 rounded-lg mb-4">
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-gray-300">{task.description}</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded mt-2">
                Submit
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Timer Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Timer</h2>
        <div className="bg-gray-800 p-4 rounded-lg">
          <input
            type="number"
            placeholder="Enter time in seconds"
            className="w-full mt-2 p-2 rounded bg-gray-700 text-white"
            value={inputTime}
            onChange={(e) => setInputTime(e.target.value)}
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mt-4"
            onClick={handleStartTimer}
          >
            Set Timer
          </button>
          <p className="text-center text-xl mt-2">{timer > 0 ? `${timer} seconds remaining` : "No active timer"}</p>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
