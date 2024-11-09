"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const SoloStudyPage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timer, setTimer] = useState(0); // Time in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [isTimerPopupOpen, setIsTimerPopupOpen] = useState(false);
  const [isGoalsPopupOpen, setIsGoalsPopupOpen] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [timerError, setTimerError] = useState(""); // For error messages

  const toggleTimerPopup = () => {
    setIsTimerPopupOpen(!isTimerPopupOpen);
  };

  const toggleGoalsPopup = () => {
    setIsGoalsPopupOpen(!isGoalsPopupOpen);
  };

  useEffect(() => {
    // Wait for 5 seconds before making the video visible
    const timer = setTimeout(() => {
      setIsVideoReady(true);
    }, 5800); // 5000 ms = 5 seconds

    // Clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  // Timer functionality
  useEffect(() => {
    let interval;
    if (timerActive && timer > 0) {
      interval = setInterval(() => setTimer(timer - 1), 1000);
    } else if (timer === 0 && timerActive) {
      setTimerActive(false);
      toast.success("Time's up!");
    }
    return () => clearInterval(interval);
  }, [timer, timerActive]);

  // Retrieve tasks from localStorage
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Store tasks in localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  // Task functions
  const handleAddTask = () => {
    if (newTask) {
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      setNewTask(""); // Reset input field
    }
  };

  const handleRemoveTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks)); // Update localStorage
  };

  // Validate time inputs and start the timer
  const handleStartTimer = () => {
    const hoursInt = parseInt(hours) || 0;
    const minutesInt = parseInt(minutes) || 0;
    const secondsInt = parseInt(seconds) || 0;

    // Validation
    if (hoursInt < 0 || minutesInt < 0 || minutesInt > 59 || secondsInt < 0 || secondsInt > 59) {
      toast.error("Please enter valid hours, minutes (0-59), and seconds (0-59).");
      return;
    }

    setTimerError(""); // Clear error if valid
    const totalSeconds = hoursInt * 3600 + minutesInt * 60 + secondsInt;
    setTimer(totalSeconds);
    setTimerActive(true);
    setIsTimerPopupOpen(false);
  };

  // Format time in hh:mm:ss
  const formatTime = (timeInSeconds) => {
    const h = Math.floor(timeInSeconds / 3600);
    const m = Math.floor((timeInSeconds % 3600) / 60);
    const s = timeInSeconds % 60;

    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative min-h-screen">
      {/* YouTube Video as Background */}
      <div
        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${isVideoReady ? "opacity-100" : "opacity-0"}`}
      >
        <iframe
          src="https://www.youtube.com/embed/cLOP0Kr36ZA?start=5&loop=1&playlist=cLOP0Kr36ZA&showinfo=0&controls=0&disablekb=0&fs=0&rel=0&iv_load_policy=3&autoplay=1&mute=1&modestbranding=1&playsinline=1&enablejsapi=1"
          title="YouTube Video"
          frameBorder="0"
          allow="autoplay; fullscreen"
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>

      {/* Static Image Overlay */}
      {!isVideoReady && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-500 flex justify-center items-center">
          <a
            // src="your-thumbnail-image-url.jpg" // Use your own image here
            alt="Loading.."
            className="w-auto h-auto max-w-full max-h-full"
          />
        </div>
      )}

      {/* Content */}
      <div className="absolute inset-0 bg-black opacity-50"></div> {/* Optional overlay */}
      <div className="p-8 min-h-screen relative z-10">
        <h1 className="text-2xl font-bold text-white mb-6">Solo Study</h1>

        {/* Buttons */}
        <div className="mb-4 flex space-x-4">
          <button
            onClick={toggleTimerPopup}
            className="bg-gray-800 p-3 rounded-lg text-white"
          >
            {timerActive
              ? formatTime(timer) // Display formatted time when active
              : "Timer"}
          </button>
          <button
            onClick={toggleGoalsPopup}
            className="bg-gray-800 p-3 rounded-lg text-white"
          >
            Goals
          </button>
        </div>

        {/* Timer Popup */}
        {isTimerPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-gray-500 p-6 rounded-lg max-w-sm w-full">
              <h2 className="text-xl font-semibold mb-4">Set Timer</h2>
              <div className="flex space-x-4 mb-4">
                <input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="p-2 text-black rounded w-full"
                  placeholder="Hours"
                />
                <input
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className="p-2 text-black rounded w-full"
                  placeholder="Minutes"
                />
                <input
                  type="number"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  className="p-2 text-black rounded w-full"
                  placeholder="Seconds"
                />
              </div>
              {/* Error Message */}
              {timerError && <p className="text-red-500 text-sm mb-4">{timerError}</p>}
              <div className="flex justify-between">
                <button
                  onClick={handleStartTimer}
                  className="bg-green-500 p-2 rounded text-white"
                >
                  Start
                </button>
                <button
                  onClick={toggleTimerPopup}
                  className="bg-red-500 p-2 rounded text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Goals Popup */}
        {isGoalsPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-gray-500 p-6 rounded-lg max-w-sm w-full">
              <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
              <input
                type="text"
                placeholder="Add a new task"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="p-2 text-black rounded w-full mb-2"
              />
              <button
                onClick={handleAddTask}
                className="bg-blue-500 p-2 rounded text-white mb-4"
              >
                Add Task
              </button>
              <ul className="space-y-2">
                {tasks.map((task, index) => (
                  <li key={index}   className="text-black bg-gray-200 p-3 mb-2 rounded flex justify-between">
                    {task}
                    <button
                      onClick={() => handleRemoveTask(index)}
                      className="bg-red-500 text-white p-1 rounded-lg"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={toggleGoalsPopup}
                className="bg-red-500 p-2 rounded text-white mt-4"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoloStudyPage;
