"use client";
// CampusChamp/pages/CalendarPage.js
import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getActivities,addActivity } from '../../../lib/actions/activity';

const CalendarPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activities, setActivities] = useState([]);
    const [description, setDescription] = useState('');

    // Fetch activities on initial load
    useEffect(() => {
        const fetchActivities = async () => {
            const fetchedActivities = await getActivities({ userId: 'userId' }); // Replace with actual user ID
            setActivities(fetchedActivities);
        };
        fetchActivities();
    }, []);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleAddActivity = async () => {
        if (description) {
            const newActivity = {
                date: selectedDate,
                description,
                userId: 'userId' // Replace with actual user ID
            };
            await addActivity(newActivity);
            setActivities([...activities, newActivity]);
            setDescription('');
        }
    };

    return (
        <div className="calendar-container">
            <h1>My Calendar</h1>
            <Calendar onChange={handleDateChange} value={selectedDate} />
            <div className="activity-form">
                <h2>Add Activity for {selectedDate.toDateString()}</h2>
                <input
                    type="text"
                    placeholder="Activity description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button onClick={handleAddActivity}>Add Activity</button>
            </div>
            <div className="activity-list">
                <h2>Activities</h2>
                <ul>
                    {activities.map((activity, index) => (
                        <li key={index}>
                            {activity.date}: {activity.description}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CalendarPage;