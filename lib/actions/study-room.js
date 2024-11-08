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

export const createroom = async (req) => {
    const { name, participants, creatorId, description } = req;
  
    try {
      await connect();
  
      // Fetch the user (creator) before proceeding
      const use = await User.findOne({ _id: creatorId });
  
      if (!use) {
        throw new Error("Creator not found");
      }
  
      // Create the new study room
      const newRoom = await StudyRoom.create({
        roomName: name,
        creatorId,
        participants:[creatorId], // Creator is the first participant
        roomDescription: description,
      });
  
      // Send invitations and notifications to participants (excluding the creator)
      participants.forEach(async (participantId) => {
        if (participantId !== creatorId) { // Don't send a request to the creator
          // Create a join request for the participant
          await JoinRequest.create({
            roomId: newRoom._id,
            senderId: creatorId,
            receiverId: participantId,
            status: "pending", // Request is pending
          });
  
          // Create a notification for the participant
          const notification = await Notification.create({
            userId: participantId,
            message: `A new study room ${name} has been created by ${use.username} and they have invited you.`,
            date: new Date(),
          });
          await notification.save();
  
          // Trigger a Pusher event to notify the participant in real time
          await pusher.trigger(
            `room-${participantId}`,
            'room-created',
            {
              message: `A new study room ${name} has been created by ${use.username} and they have invited you.`,
            }
          );
        }
      });
  
      return newRoom;
    } catch (error) {
      console.log(error);
      throw new Error("Error creating room");
    }
  };
  

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
    await connect(); // Ensure you are connected to the database
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
  
      // Fetch the user and room details
      const use = await User.findOne({ _id: userId });
      const room = await StudyRoom.findOne({ _id: roomId });
      room.participants.push(userId);
      await room.save();

      if (!use || !room) {
        throw new Error("User or room not found");
      }
  
  
      // Logging for debugging
      console.log(`Notification to be created for sender: ${joinRequest.senderId}`);
      
      // Create the notification for the sender (creator of the room)
      const notification =await Notification.create({
        userId: joinRequest.senderId,
        message: `Your request to join the study room ${room.roomName} has been accepted by ${use.username}.`,
        date: new Date(),
      });
  
      // Save the notificatio
     /// console.log("Notification saved:", notification);
  
      // Trigger a Pusher event to notify the participant (sender) in real time
      await pusher.trigger(
        `room-${joinRequest.senderId}`,
        'room-created', // Changed event name to 'request-accepted'
        {
          message: `Your request to join the study room ${room.roomName} has been accepted by ${use.username}.`,
        }
      );
  
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
      const use = await User.findOne({ _id: userId });
  
      if (!use || !room) {
        throw new Error("User or room not found");
      }
  
  
      // Logging for debugging
      //console.log(`Notification to be created for sender: ${joinRequest.senderId}`);
      
      // Create the notification for the sender (creator of the room)
      const notification =await Notification.create({
        userId: result.senderId,
        message: `Your request to join the study room ${room.roomName} has been rejected by ${use.username}.`,
        date: new Date(),
      });
  
      // Save the notificatio
  
  
      // Trigger a Pusher event to notify the participant (sender) in real time
      await pusher.trigger(
        `room-${result.senderId}`,
        'room-created', // Changed event name to 'request-accepted'
        {
          message: `Your request to join the study room ${room.roomName} has been rejected by ${use.username}.`,
        }
      );
  
      return { message: "Request deleted successfully!" };
  
    } catch (error) {
      console.error("Error deleting the request:", error);
      return { error: error.message };
    }
  };

  
  export const Userroom = async (req) => {
    await connect();
    try {
      const { userId } = req;
  
      // Fetch all study rooms where the user's ID is included in the participants array
      const rooms = await StudyRoom.find({ participants: userId });
  
      return rooms;
    } catch (error) {
      console.log("Error fetching user rooms:", error);
      return { error: error.message };
    }
  };

  export const Leftroom = async (req) => {
    await connect();
    try {
      const { userId, roomId } = req;
  
      // Remove the user from the participants array of the specified room
      const room = await StudyRoom.findByIdAndUpdate(
        roomId,
        { $pull: { participants: userId } },
        { new: true }
      );
  
      if (!room) {
        throw new Error("Room not found or user not a participant");
      }
      const use = await User.findOne({ _id: userId });
      const notification =await Notification.create({
        userId: room.creatorId,
        message: `${use.username} has left the study room ${room.roomName}.`,
        date: new Date(),
      });
  
      // Save the notificatio
  
  
      // Trigger a Pusher event to notify the participant (sender) in real time
      await pusher.trigger(
        `room-${room.creatorId}`,
        'room-created', // Changed event name to 'request-accepted'
        {
          message: `${use.username} has left the study room ${room.roomName}.`,
        }
      );
  
      return { message: "User removed from room successfully", room };
    } catch (error) {
      console.log("Error removing user from room:", error);
      return { error: error.message };
    }
  };

  export const Getroom=async(req)=>{
    await connect();
    try {
      const { roomId } = req;
  
      const rooms = await StudyRoom.findOne({ _id: roomId });
      const prt=await Promise.all(rooms.participants.map(async (participantId) => {
        const user = await User.findOne({ _id: participantId });
        return user;

      }))
      
      rooms.participants=prt;
     
      return rooms;
    } catch (error) {
      console.log("Error fetching user rooms:", error);
      return { error: error.message };
    }
  }
  
  export const setTimer=async(req)=>{
    await connect();
    try {
      const { roomId, duration } = req;
      if (!roomId || !Number.isInteger(duration) || duration <= 0) {
        return NextResponse.json({ error: "Invalid duration or room ID" }, { status: 400 });
      }
      const startTime = new Date();
      await Timer.findOneAndUpdate(
        { roomId },
        { startTime, duration },
        { upsert: true, new: true }
      );
      // Trigger the 'start-timer' event on the specified room channel
      await pusher.trigger(`room-${roomId}`, "start-timer", {
        duration, // Broadcast the timer duration to all users in the room
      });
      
      return ({ success: true, message: "Timer started successfully" });
    } catch (error) {
      console.error("Error in /api/timer:", error);
      return({ error: "Failed to start timer" }, { status: 500 });
    }
  }
  
  export const getTimer=async(req)=>{
    await connect();
    try {
      const { roomId } = req;
      const timer = await Timer.findOne({ roomId });
    //  console.log(timer,"timer")
      if (!timer) return ({ error: "No timer found" });
      
      const elapsedSeconds = Math.floor((new Date() - timer.startTime) / 1000);
      const remainingTime = Math.max(timer.duration - elapsedSeconds, 0);
      console.log(remainingTime,"controlller")
      return  remainingTime;
    } catch (error) {
      return ({ error: "Failed to fetch timer" });
    }
  }
  
