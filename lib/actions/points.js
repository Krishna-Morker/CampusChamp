import { connect } from '../mongodb/mongoose';
const mongoose = require('mongoose');
import Course from '../models/coursemodel';
import User from '../models/usermodel';
import Assignment from '../models/assignmentmodel'


export const incPoints = async (req) => {
    await connect();
    try {
      const {assignmentId,points}=req;
      const as = await Assignment.findOne({ _id: assignmentId });
    as.uploads.map(async (e) => {
      const user = await User.findOne({ _id: e.studentId });
      user.points = user.points + points;
      await user.save();
    })
   
    return "Successfully Updated Points";
    } catch (error) {
      console.log('Error in crteating assignment', error);
    }
  };
  export const Points = async (req) => {
    await connect();
    try {
      const {studentId,points}=req;
      const user = await User.findOne({ _id: studentId });
      user.points = user.points + points;
      await user.save();
    return "Successfully Updated Points";
    } catch (error) {
      console.log('Error in crteating assignment', error);
    }
  };