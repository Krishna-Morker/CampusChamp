"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import Pusher from 'pusher-js';
import {use, useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import Page from '@/app/home/Room/Addtask/Page';
import { useRouter } from "next/navigation";

const RoomPage = ({ params }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const router= useRouter()
  const chatContainerRef = useRef(null);

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
    newChannel.bind('task-created', (data) => {
      
     toast.success(data.message); // Sync timer with other users
     fetchRoomData()
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
   

    fetchRoomData();
  }, [roomId, user.id]);
  const isOpen = () => {
    setIsModalOpen(true);
  };

  const onClose = () => {
    setIsModalOpen(false);
    fetchRoomData();
  };

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
  const remtask = async (tasid) => {
   
    try {
      const ge = "remtask";
      
      await axios.post(`/api/task`, { ge,roomId, tasid});
      //toast.info("Assignment removed.");
      // Fetch assignments again to reflect the latest state
      fetchRoomData();
    } catch (error) {
      console.log("Error removing file:", error);
      toast.error("Failed to remove assignment.");
    }
  };
  const handleLeaveRoom = async () => {
    try {
      if (channel) {
        channel.unbind_all();
        channel.unsubscribe();
        toast.success("You have left the room.");
      }
      router.push('/home/Room');
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
      <div className="flex items-center justify-between mb-9">
        <h2 className="text-2xl font-semibold mb-4">Tasks & Assignments</h2>
        <button
            onClick={isOpen}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-full shadow-md hover:scale-105 transition-transform duration-150"
          >
            + Add New Task for all
          </button>
        
        </div>
        <div className="space-y-6 mb-6">
          {tasks?.map((task) => (
             <div
             key={task._id}
             className="p-5 rounded-xl shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl text-white"
             style={{  backgroundColor: '#31363f'}}
           >
             <h2 className="text-2xl font-semibold text-white mb-2">{task.title}</h2>
             <p className="text-white mb-4">{task.description}</p>
            <div className="space-x-6">
             {task.fileUrl && (
               <a
                 href={task.fileUrl}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-white-600 bg-gray-900 rounded-md py-2 px-4 underline hover:text-blue-100 mb-4 inline-block transition-colors duration-150"
               >
                 Download Assignment
               </a>
             )}
               <button
                     onClick={()=>remtask(task._id)} 
                    className="bg-gradient-to-r from-red-500 to-pink-600 text-white mt-4 py-2 px-4 rounded-full shadow-md hover:scale-105 transition-transform duration-150"
                  >
                  Remove assignment
                  </button>
              </div>
           </div>
          ))}
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
      {isModalOpen && <Page isOpen={isOpen} onClose={onClose} roomId={roomId} />}
    </div>
  );
};

export default RoomPage;
