import { connect } from '../mongodb/mongoose';
import Activity from '../models/activitymodel';  // Assuming you have an Activity model
import mongoose from 'mongoose';

export const createActivity = async (req) => {
  await connect();
  try {
    const { userId, date, title, details } = req.body;
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const activity = await Activity.updateOne(
      { userId, date:startOfDay },
      { $push: { description: { title, details } } },
      { upsert: true }
    );

    console.log("Activity added successfully");
    return "Successfully added activity";
  } catch (error) {
    console.log('Error in creating activity', error);
    throw new Error('Error in creating activity');
  }
};

export const getActivity = async (req) => {
  await connect();
  try {
    const { userId, date } = req;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const activity = await Activity.findOne({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    return activity;
  } catch (error) {
    console.log('Error in fetching activities', error);
    throw new Error('Error in fetching activities');
  }
};
export const getAllUserActivities = async (req) => {
  await connect();
  try {
    const { userId } = req;

    const activities = await Activity.find({ userId });
    return activities;
  } catch (error) {
    console.error('Error in fetching all user activities', error);
    throw new Error('Error in fetching all user activities');
  }
}

export const deleteActivity = async (req) => {
  await connect();
  try {
    const { userId, descriptionId, activityId } = req.body;

    // Perform the update, pulling the specific description entry
    const result = await Activity.updateOne(
      { _id: activityId, userId }, // Match document by activityId and userId
      { $pull: { description: { _id: descriptionId } } } // Remove the specific description by descriptionId
    );

    // Check if the modification took place
    if (result.modifiedCount > 0) {
      console.log("Description deleted successfully");
      const activity = await Activity.findById(activityId);
      if (activity && activity.description.length === 0) {
        // Step 3: Delete the entire document if description is empty
        await Activity.deleteOne({ _id: activityId });
        console.log("Activity document deleted as it has no descriptions left.");
        return { message: "Activity document deleted as it has no descriptions left." };
      }
      return {message:"Description deleted successfully"}
      
    } else {
      console.log("No matching description found to delete");
      return { message: "No matching description found" };
    }
  } catch (error) {
    console.error('Error in deleting description', error);
    return { error: "An error occurred" };
  }
};


