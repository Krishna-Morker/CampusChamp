import { connect } from '../mongodb/mongoose';
import Timetable from '../models/weeklytimetablemodel'; 

// Controller to create a new timetable entry for a user
export const createTimetableEntry = async (req) => {
  await connect();
  try {
    const { userId, entry } = req.body; // `entry` is an object with { day, time, subject }

    // Find the user's timetable document
    let timetable = await Timetable.findOne({ userId });

    if (timetable) {
      // Add the new timetable entry to the existing timetable document
      timetable.entity.push(entry); // Add the new entry
      await timetable.save(); // Save the updated timetable
    } else {
      // If no timetable exists, create a new timetable document with the entry
      timetable = new Timetable({
        userId,
        entity: [entry], // Wrap the entry in an array
      });
      await timetable.save(); // Save the newly created timetable document
    }

    console.log("Timetable entry added successfully");
    return "Successfully added timetable entry";
  } catch (error) {
    console.error('Error in creating timetable entry', error);
    throw new Error('Error in creating timetable entry');
  }
};

// Controller to fetch all timetable entries for a user
export const getTimetable = async (req) => {
  await connect();
  try {
    const { userId } = req;

    const timetable = await Timetable.findOne({ userId });
    return timetable ? timetable : "No timetable found for this user.";
  } catch (error) {
    console.error('Error in fetching timetable entries', error);
    throw new Error('Error in fetching timetable entries');
  }
};

// Controller to delete a specific timetable entry by day and time
export const deleteTimetableEntry = async (req) => {
  await connect();
  try {
    const { userId, day, time } = req.body;

    const result = await Timetable.updateOne(
      { userId },
      { $pull: { entity: { day, time } } }
    );

    if (result.modifiedCount > 0) {
      console.log("Timetable entry deleted successfully");
      return  "Timetable entry deleted successfully" ;
    } else {
      console.log("No matching timetable entry found to delete");
      return  "No matching timetable entry found" ;
    }
  } catch (error) {
    console.error('Error in deleting timetable entry', error);
    return { error: "An error occurred" };
  }
};
