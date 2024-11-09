import { connect } from '../mongodb/mongoose';
const mongoose = require('mongoose');
import Course from '../models/coursemodel';
import User from '../models/usermodel';
import Assignment from '../models/assignmentmodel'
import Challenges from '../models/challengemodel';
import pusher from './pusherConfig';
import Notification from '../models/notificationmodel';
import StudyRoom from '../models/studyroommodel';
import JoinRequest from '../models/joinrequestmodel';
import Timer from '../models/timermodel';


export const addTask = async (req) => {
    await connect();
    try {
      const { roomId, title, description, urls } = req;
     //   console.log(req,"req")
      // Find the study room
      const room = await StudyRoom.findOne({ _id: roomId });
      if (!room) {
        return "Room not found";
      }
  
      // Create the task
      const task = {
        title: title,
        description: description,
        fileUrl: urls,
      };
  
      // Add task to the room and save
      room.tasks.push(task);
      await room.save();
  
      // Notify via Pusher in the course-specific channel
      await pusher.trigger(
        `room-${roomId}`,
        'task-created',
        {
          message: `A new task titled "${title}" has been uploaded in ${room.roomName}`,
        }
      );
    console.log(room)
      return "Successfully added Task";
    } catch (error) {
      console.log('Error in creating Task', error);
      return "Error creating Task";
    }
  };


    
  export const remTask = async (req) => {
    await connect();
    try {
      const { roomId,tasid } = req;
      const as = await StudyRoom.findOne({ _id: roomId });
      const filteredFiles = as.tasks.filter(file => file._id.toString() !== tasid);
      as.tasks=filteredFiles;
      await pusher.trigger(
        `room-${roomId}`,
        'task-created',
        {
          message: `Task has been removed in ${as.roomName}`,
        }
      );
      await as.save();
      return "Successfully removed Task";
    } catch (error) {
      console.log('Error in removing Task', error);
    }
  };
  