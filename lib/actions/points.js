import { connect } from '../mongodb/mongoose';
const mongoose = require('mongoose');
import Course from '../models/coursemodel';
import User from '../models/usermodel';
import Assignment from '../models/assignmentmodel'
import Challenges from '../models/challengemodel';
import pusher from './pusherConfig';
import Notification from '../models/notificationmodel';


export const incPoints = async (req) => {
    await connect();
    try {
      const {assignmentId,points,isOnTime}=req;
      const as = await Assignment.findOne({ _id: assignmentId });
    as.uploads.map(async (e) => {
      if(isOnTime && new Date(e.submissionDate) <= new Date(as.dueDate)){
      const user = await User.findOne({ _id: e.studentId });
      user.points = user.points + points;
      await user.save();
      const notification = await Notification.create({
        userId: e.studentId,
        message: `You have been awarded ${points} points for ${as.title}`,
        date: new Date(),
      });
      await pusher.trigger(
        `course-${as.courseId}-notifications`,
        'assignment-created',
        {
          message: `You have been awarded ${points} points for ${as.title}`,
        }
      );
      }else if(!isisOnTime && new Date(e.submissionDate) > new Date(as.dueDate)){
        const user = await User.findOne({ _id: e.studentId });
      user.points = user.points + points;
      await user.save();
      const notification = await Notification.create({
        userId: e.studentId,
        message: `You have been awarded ${points} points for ${as.title}`,
        date: new Date(),
      });
      await pusher.trigger(
        `course-${as.courseId}-notifications`,
        'assignment-created',
        {
          message: `You have been awarded ${points} points for ${as.title}`,
        }
      );

      }  
      await notification.save();
    })

    
    return "Successfully Updated Points";
    } catch (error) {
      console.log('Error in crteating assignment', error);
    }
  };
  export const Points = async (req) => {
    await connect();
    try {
      const {studentId,points,assignmentId,type}=req;
      const user = await User.findOne({ _id: studentId });
      user.points = user.points + points;
      await user.save();
      let as;
      if(type==undefined){
       as = await Assignment.findOne({ _id: assignmentId });
      }else{
        as=await Challenges.findOne({ _id: assignmentId,type:type });
      }
      const notification = await Notification.create({
        userId: studentId,
        message: `You have been awarded extra ${points} points for ${as.title}`,
        date: new Date(),
      });
      await pusher.trigger(
        `course-${as.courseId}-notifications`,
        'assignment-created',
        {
          message: `You have been awarded extra ${points} points for ${as.title}`,
        }
      );  
    return "Successfully Updated Points";
    } catch (error) {
      console.log('Error in crteating assignment', error);
    }
  };

  export const ChallengePoints = async (req) => {
    await connect();
    try {
      const {assignmentId,points}=req;
      const as = await Challenges.findOne({ _id: assignmentId });
    as.uploads.map(async (e) => {
      const user = await User.findOne({ _id: e.studentId });
      user.points = user.points + points;
      await user.save();
      const notification = await Notification.create({
        userId: e.studentId,
        message: `You have been awarded ${points} points for ${as.title}`,
        date: new Date(),
      });
      await pusher.trigger(
        `course-${as.courseId}-notifications`,
        'assignment-created',
        {
          message: `You have been awarded ${points} points for ${as.title}`,
        }
      );  
    })
   
    return "Successfully Updated Points";
    } catch (error) {
      console.log('Error in crteating assignment', error);
    }
  };
  