import { connect } from '../mongodb/mongoose';
import mongoose from 'mongoose';
import Activity from '../models/activitymodel';

export const addActivity = async (req) => {
    await connect();
    try {
        const { date, description, userId } = req;
        const activity = await Activity.create({
            date: new Date(date),
            description,
            userId,
        });

        console.log(activity, "Activity added");
        return "Successfully added activity";
    } catch (error) {
        console.log('Error adding activity', error);
    }
};

export const getActivities = async (req) => {
    await connect();
    try {
        const { userId, date } = req;
        const filters = { userId };
        if (date) filters.date = new Date(date);

        const activities = await Activity.find(filters);
        return activities;
    } catch (error) {
        console.log('Error fetching activities', error);
    }
};

export const getActivityById = async (req) => {
    await connect();
    try {
        const { id } = req;
        const activity = await Activity.findById(id);
        if (!activity) return "Activity not found";
        
        return activity;
    } catch (error) {
        console.log('Error fetching activity by ID', error);
    }
};

export const updateActivity = async (req) => {
    await connect();
    try {
        const { id, date, description } = req;

        const updatedActivity = await Activity.findByIdAndUpdate(
            id,
            { date: new Date(date), description },
            { new: true }
        );

        if (!updatedActivity) return "Activity not found";
        
        console.log(updatedActivity, "Activity updated");
        return "Successfully updated activity";
    } catch (error) {
        console.log('Error updating activity', error);
    }
};

export const deleteActivity = async (req) => {
    await connect();
    try {
        const { id } = req;

        const deletedActivity = await Activity.findByIdAndDelete(id);
        if (!deletedActivity) return "Activity not found";

        console.log(deletedActivity, "Activity deleted");
        return "Successfully deleted activity";
    } catch (error) {
        console.log('Error deleting activity', error);
    }
};
