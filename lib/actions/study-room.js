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

export const createroom= async(req)=>{
  
 const { name, participants, creatorId ,description} = req;
    try {
        await connect();
        const newRoom = await StudyRoom.create({
            roomName:name,
            creatorId,
            participants, // Creator is the first participant
            roomDescription:description,
        });

       // console.log(newRoom);
       participants.forEach(async (participantId) => {
        if (participantId !== creatorId) { // Don't send a request to the creator
          await JoinRequest.create({
            roomId: newRoom._id,
            senderId: creatorId,
            receiverId: participantId,
            status: "pending", // Request is pending
          });
        }
      });

        return newRoom;
    } catch (error) {
        console.log(error);
    }
}

export const Pendingrequest = async (req) => {
    await connect();
    try {
      const { fg } = req;
      
      // Fetch the pending join requests for the user (based on 'fg' value)
      const res = await JoinRequest.find({ receiverId: fg, status: "pending" });
  
      // Use Promise.all to handle async operations inside map
      const transformedResults = await Promise.all(
        res.map(async (record) => {
          // For each record, find the corresponding study room details
          const room = await StudyRoom.findOne({ _id: record.roomId });
          return room; // Return the room object
        })
      );
      return transformedResults;
    } catch (error) {
      console.log(error);
    }
  };
  export const Acceptrequest = async (req) => {
    await connect();
    try {
      const { roomId, userId } = req;
  
      // Find the pending join request
      const joinRequest = await JoinRequest.findOne({ receiverId: userId, roomId: roomId, status: "pending" });
  
      if (!joinRequest) {
        throw new Error("No pending request found for this user in this room");
      }
  
      // Update the status to accepted
      joinRequest.status = "accepted";
      await joinRequest.save(); // Save the updated request
  
      return { message: "Request accepted successfully!" };
    } catch (error) {
      console.error("Error accepting the request:", error);
      return { error: error.message };
    }
  };
  
  export const Deleterequest = async (req) => {
    await connect();
    try {
      const { roomId, userId } = req;
  
      // Delete the pending join request
      const result = await JoinRequest.findOneAndDelete({ receiverId: userId, roomId: roomId, status: "pending" });
  
      if (!result) {
        throw new Error("No pending request found for this user in this room");
      }
      const room = await StudyRoom.findById(roomId);
      if (room) {
        // Remove the user from participants
        room.participants = room.participants.filter(participant => participant.toString() !== userId);
        await room.save(); // Save the updated room
      }
  
      return { message: "Request deleted successfully!" };
  
    } catch (error) {
      console.error("Error deleting the request:", error);
      return { error: error.message };
    }
  };