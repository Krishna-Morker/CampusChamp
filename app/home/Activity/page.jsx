'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Loader from '@/components/Loader';

const SeeActivities = () => {
  const [date, setDate] = useState(new Date());
  const [activity, setActivity] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const fetchAllActivities = async () => {
      setIsLoading(true);
      try {
        const p = user.id;
        const id = await axios.post('/api/user', { id: p });
        const fg = id.data._id;
        const response = await axios.post('/api/activity', {
          ge: 'get_all',
          userId: fg,
        });
        setActivities(response.data);
      } catch (error) {
        console.error('Error fetching all user activities', error);
      }
      setIsLoading(false);
      setLoading((false))
    };
    fetchAllActivities();
  }, []);

  useEffect(() => {
    const selectedDate = date.toISOString().split('T')[0];
    const filteredActivity = activities.find((act) => act.date.split('T')[0] === selectedDate);
    setActivity(filteredActivity || null);
  }, [date, activities]);

  const handleDateChange = (newDate) => setDate(newDate);

  const handleAddActivity = async () => {
    if (newTitle && newDetails) {
      try {
        const p = user.id;
        const id = await axios.post('/api/user', { id: p });
        const fg = id.data._id;
        const selectedDate = date.toISOString().split('T')[0];

        const existingActivityIndex = activities.findIndex(
          (act) => act.date.split('T')[0] === selectedDate
        );

        if (existingActivityIndex !== -1) {
          const updatedActivities = [...activities];
          updatedActivities[existingActivityIndex].description.push({
            title: newTitle,
            details: newDetails,
          });
          setActivities(updatedActivities);
        } else {
          setActivities((prevActivities) => [
            ...prevActivities,
            {
              _id: Math.random().toString(),
              userId: fg,
              date: date.toISOString(),
              description: [{ title: newTitle, details: newDetails }],
            },
          ]);
        }

        setNewTitle('');
        setNewDetails('');

        await axios.post('/api/activity', {
          ge: 'create',
          userId: fg,
          date: date.toISOString(),
          title: newTitle,
          details: newDetails,
        });
      
      } catch (error) {
        console.error('Error adding activity', error);
      }
    }
  };

  const handleDeleteActivity = async (activityId, descriptionId) => {
    try {
      const p = user.id;
      const id = await axios.post('/api/user', { id: p });
      const fg = id.data._id;
      setActivities((prevActivities) =>
        prevActivities.map((act) => {
          if (act._id === activityId) {
            return {
              ...act,
              description: act.description.filter(
                (desc) => desc._id !== descriptionId
              ),
            };
          }
          return act;
        })
      );

      await axios.post('/api/activity', {
        ge: 'delete',
        activityId,
        descriptionId,
        userId: fg,
      });
    } catch (error) {
      console.error('Error deleting description', error);
    }
  };
  if(loading)return <Loader/>
  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Activities for {date.toDateString()}</h1>
      <div className="flex justify-center mb-8">
        <Calendar
          onChange={handleDateChange}
          value={date}
          className="text-black rounded-lg"
        />
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6 max-w-lg mx-auto">
        <h2 className="text-xl font-semibold mb-4">Add New Activity for {date.toDateString()}</h2>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Activity Title"
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          value={newDetails}
          onChange={(e) => setNewDetails(e.target.value)}
          placeholder="Activity Details"
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddActivity}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded"
        >
          Add Activity
        </button>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg mx-auto">
          <h2 className="text-xl font-semibold mb-4">Activity Details</h2>
          {activity ? (
            <div key={activity._id}>
              {activity.description.map((desc) => (
                <div key={desc._id||Math.random()} className="mb-4 p-4 bg-gray-700 rounded-lg">
                  <h4 className="text-lg font-semibold">{desc.title}</h4>
                  <p className="text-gray-300">{desc.details}</p>
                  <button
                    onClick={() => handleDeleteActivity(activity._id, desc._id)}
                    className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No activity for this day.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SeeActivities;

