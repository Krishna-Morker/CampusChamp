'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from '@clerk/nextjs';
import { FaPlus, FaTrash } from 'react-icons/fa'; // Import icons for add and delete

import Loader from '../../../components/Loader';

const TimetablePage = () => {
  const [timetable, setTimetable] = useState({});
  const [subjectInput, setSubjectInput] = useState("");
  const [editCell, setEditCell] = useState(null);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  const timeSlots = [
    '8:00', '9:00', '10:00', '11:00', '12:00',
    '1:00', '2:00', '3:00', '4:00', '5:00'
  ];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    setLoading(true);
    const fetchTimetable = async () => {
      try {
        const p = user.id;
        const id = await axios.post('/api/user', { id: p });
        const fg = id.data._id;
        const response = await axios.post('/api/weeklytimetable', {
          ge: 'get',
          userId: fg
        });
        setTimetable(response.data);
      } catch (error) {
        console.error("Error fetching timetable", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  if (loading) return <Loader />;

  const renderTimetableCell = (day, time) => {
    const entry = timetable?.entity?.find(
      (entry) => entry.day === day && entry.time === time
    );

    if (editCell?.day === day && editCell?.time === time) {
      return (
        <div className="p-2 bg-gray-800 text-white flex justify-center items-center rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-200">
          <form
            onSubmit={(e) => handleAddEntry(e, day, time)}
            className="flex space-x-2 w-full"
          >
            <input
              type="text"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              className="p-2 border-2 border-gray-600 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Enter subject"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              <FaPlus />
            </button>
          </form>
        </div>
      );
    }

    return entry ? (
      <div className="p-2 bg-blue-800 text-white flex justify-between items-center rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 relative">
        <span>{entry.subject}</span>
        <button
          className="text-red-400 hover:text-red-500 transition opacity-0 hover:opacity-100 absolute right-2 top-2"
          onClick={() => handleDeleteEntry(day, time)}
          >
          <FaTrash />
        </button>
      </div>
    ) : (
      <div className="p-2 bg-gray-900 text-white flex justify-center items-center rounded-lg  hover:bg-gray-700 transition-colors duration-200 relative group">
        <button
          className="text-green-400 hover:text-green-500 transition opacity-0 group-hover:opacity-100"
          onClick={() => setEditCell({ day, time })}
        >
          <FaPlus />
        </button>
      </div>
    );
  };

  const handleAddEntry = async (e, day, time) => {
    e.preventDefault();
    if (!subjectInput) return;

    try {
      const p = user.id;
      const id = await axios.post('/api/user', { id: p });
      const fg = id.data._id;
      const response = await axios.post('/api/weeklytimetable', {
        ge: 'create',
        userId: fg,
        entry: { day, time, subject: subjectInput },
      });
      alert(response.data);
      setTimetable((prevTimetable) => {
        const updatedTimetable = { ...prevTimetable };
        if (!updatedTimetable.entity) {
          updatedTimetable.entity = [];
        }
        updatedTimetable.entity.push({ day, time, subject: subjectInput });
        return updatedTimetable;
      });
      setSubjectInput("");
      setEditCell(null);
    } catch (error) {
      console.error("Error adding entry", error);
    }
  };

  const handleDeleteEntry = async (day, time) => {
    try {
      const p = user.id;
      const id = await axios.post('/api/user', { id: p });
      const fg = id.data._id;
      const response = await axios.post('/api/weeklytimetable', {
        ge: 'delete',
        userId: fg,
        day,
        time,
      });
      alert(response.data);
      setTimetable((prevTimetable) => {
        const updatedTimetable = {
          ...prevTimetable,
          entity: prevTimetable.entity.filter(
            (entry) => !(entry.day === day && entry.time === time)
          ),
        };
        return updatedTimetable;
      });
    } catch (error) {
      console.error("Error deleting entry", error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center mt-2">Your Timetable</h1>

      <table className="table-auto w-full border-collapse border border-gray-600 shadow-lg rounded-md mb-20">
        <thead className="bg-gray-800">
          <tr>
            <th className="border px-6 py-3 text-left">Day/Time</th>
            {timeSlots.map((time, index) => (
              <th key={index} className="border px-6 py-3">{time}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {daysOfWeek.map((day, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border px-6 py-3 font-semibold bg-gray-800">{day}</td>
              {timeSlots.map((time, colIndex) => (
                <td key={`${rowIndex}-${colIndex}`} className="border px-6 py-3 hover:bg-gray-700 transition-colors duration-200">
                  {renderTimetableCell(day, time)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimetablePage;
