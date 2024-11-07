"use client";
import { useState, useEffect } from "react";
import { useUser } from '@clerk/nextjs';
import axios from "axios";

const CreateRoom = () => {
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState(""); // New state for room description
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const { user } = useUser();
  const [userd, setuserd] = useState(null);

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let p = user.id;
        let id = await axios.post('/api/user', { id: p });
        const fg = id.data._id;
        setuserd(id.data);
        const response = await axios.get("/api/leaderboard");
        setAllUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [user]);

  // Filter users based on search input and exclude already selected users
  useEffect(() => {
    const filtered = allUsers
      .filter((user) => user.email && user.email.toLowerCase().includes(search.toLowerCase()))
      .filter((user) => !selectedUsers.some((selectedUser) => selectedUser._id === user._id));
    setFilteredUsers(filtered);
  }, [search, allUsers, selectedUsers]);

  // Add or remove user from selected users
  const toggleUserSelection = (user) => {
    setSelectedUsers((prevSelectedUsers) => {
      const userExists = prevSelectedUsers.some((selectedUser) => selectedUser._id === user._id);

      if (userExists) {
        return prevSelectedUsers.filter((selectedUser) => selectedUser._id !== user._id);
      } else {
        return [...prevSelectedUsers, user];
      }
    });
  };

  // Handle form submission
  const handleCreateRoom = async () => {
    try {
      const roomData = {
        name: roomName,
        description: roomDescription, // Include description in room data
        participants: selectedUsers.map((user) => user._id),
        creatorId: userd._id
      };
      const ge = "createroom";
      await axios.post("/api/study-room", { roomData, ge });
      alert("Room created successfully!");
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg max-w-lg mx-auto">
      <h2 className="text-2xl text-gray-900 font-semibold mb-4">Create Group Study Room</h2>

      <label className="block mb-2 text-gray-700">Room Name</label>
      <input
        type="text"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="Enter room name"
        className="w-full mb-4 p-2 border text-gray-900 rounded"
      />

      <label className="block mb-2 text-gray-700">Room Description</label>
      <textarea
        value={roomDescription}
        onChange={(e) => setRoomDescription(e.target.value)}
        placeholder="Enter a brief description of the room"
        className="w-full mb-4 p-2 border text-gray-900 rounded"
        rows="4"
      />

      <label className="block mb-2 text-gray-700">Add Participants</label>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for users by email..."
        className="w-full mb-2 p-2 border text-gray-900 rounded"
      />

      <div className="border rounded p-2 max-h-40 overflow-y-auto">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => toggleUserSelection(user)}
            className={`p-2 cursor-pointer text-gray-900 hover:bg-blue-100 ${
              selectedUsers.some((selectedUser) => selectedUser._id === user._id) ? "bg-blue-200" : ""
            }`}
          >
            {user.email}
          </div>
        ))}
      </div>

      <div className="mt-4">
        <h3 className="text-lg text-gray-900 font-semibold m-5">Selected Participants:</h3>
        <div className="flex flex-wrap gap-2">
          {selectedUsers.map((user) => (
            <span
              key={user._id}
              onClick={() => toggleUserSelection(user)}
              className="p-2 bg-blue-500 text-white rounded-lg cursor-pointer"
            >
              <img
                src={user.avatar} // Assuming `avatar` is the URL to the user's image
                alt={`${user.username}'s avatar`}
                className="w-10 m-2 h-8 rounded-full" // Avatar styling (circle, with margin)
              />
              <span className="font-semibold">{user.username}</span> - {user.email} &times;
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={handleCreateRoom}
        className="mt-6 w-full p-2 bg-blue-600 text-white rounded-lg"
      >
        Create Room
      </button>
    </div>
  );
};

export default CreateRoom;
