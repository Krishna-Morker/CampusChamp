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

export const Getmessage = async (req) => {
    const { roomId, mess } = req;
    const { username, message } = mess;
  
    try {
      await connect();
     
  
      const newMessage = {
        username: username,
        message: message,
        roomId: roomId,
        timestamp: new Date(),
      };
  
      const room = await StudyRoom.findOne({ _id: roomId });
      if (!room) {
        throw new Error("Room not found");
      }
  
      room.messages.push(newMessage);
      await room.save();
      await pusher.trigger(
        `room-${roomId}`,
        'new-message', // Changed event name to 'request-accepted'
        {
          username: username,
          message: message,
         // message: `Your request to join the study room ${room.roomName} has been accepted by ${use.username}.`,
        }
      );
  
      return room;
    } catch (error) {
      console.log(error);
      throw new Error("Error saving message to room");
    }
  };
  

  export const Allmessage = async (req) => {
    const { roomId } = req;
  
    try {
      await connect();
      const room = await StudyRoom.findById(roomId).select('messages');
  
      if (!room) {
        throw new Error("Room not found");
      }
     // console.log(room,"kl")
  
      // Sort messages by timestamp (earliest messages first)
      const sortedMessages = room.messages.sort((a, b) => a.timestamp - b.timestamp);
  
      return sortedMessages;
    } catch (error) {
      console.log(error);
      throw new Error("Error fetching messages for room");
    }
  };
  
