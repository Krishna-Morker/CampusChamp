"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { XMarkIcon } from "@heroicons/react/24/solid";
import axios from "axios";

const CreateRoom = ({ isOpen, onClose, gh }) => {
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const { user } = useUser();
  const [userd, setUserd] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let p = user.id;
        let id = await axios.post("/api/user", { id: p });
        const fg = id.data._id;
        setUserd(id.data);
        const response = await axios.get("/api/leaderboard");
        setAllUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [user]);

  useEffect(() => {
    const filtered = allUsers
      .filter((user) => user.email && user.email.toLowerCase().includes(search.toLowerCase()))
      .filter((user) => !selectedUsers.some((selectedUser) => selectedUser._id === user._id));
    setFilteredUsers(filtered);
  }, [search, allUsers, selectedUsers]);

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

  const handleCreateRoom = async () => {
    try {
      const roomData = {
        name: roomName,
        description: roomDescription,
        participants: selectedUsers.map((user) => user._id),
        creatorId: userd._id,
      };
      const ge = "createroom";
      await axios.post("/api/study-room", { roomData, ge });
      onClose;
      gh("Room created successfully!");
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="relative bg-white p-8 rounded-xl shadow-lg w-full max-w-lg transform transition-all duration-300 scale-105">
        <h2 className="text-2xl text-gray-900 font-semibold mb-4">Create Group Study Room</h2>
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-900 hover:text-gray-700 transition duration-150">
          <XMarkIcon className="w-6 h-6" />
        </button>

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
          {search &&
            filteredUsers.map((user) => (
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
          <h3 className="text-lg text-gray-900 font-semibold mb-2">Selected Participants:</h3>
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
                  className="w-8 h-8 rounded-full mr-2" // Avatar styling (circle, with margin)
                />
                <span className="font-semibold">{user.username}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-400 transition duration-150"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateRoom}
            className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition duration-150"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
