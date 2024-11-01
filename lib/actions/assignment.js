import { connect } from '../mongodb/mongoose';
const mongoose = require('mongoose');
import Course from '../models/coursemodel';
import User from '../models/usermodel';
import Assignment from '../models/assignmentmodel'


export const Addassignment = async (req) => {
    await connect();
    try {
       const {courseId,title,description,dueDate,urls}=req
       const assi= await Assignment.create({
        courseId: courseId,
        title: title,
        description:description,
        dueDate:dueDate,
        assignmenturl:urls,
       });
       await assi.save();
       return "Successfullt addedd Assignment";
    } catch (error) {
      console.log('Error in crteating assignment', error);
    }
  };

  export const getAssigment = async (req) => {
    await connect();
    try {
        const id=req.id;
        const assi=await Assignment.find({courseId:id});
        console.log(assi);
        return assi;
    } catch (error) {
      console.log('Error in crteating assignment', error);
    }
  };
