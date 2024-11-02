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
       console.log(assi,"assignment added");
       await assi.save();
       return "Successfullt addedd Assignment";
    } catch (error) {
      console.log('Error in crteating assignment', error);
    }
  };

  export const Addstudent = async (req) => {
    await connect();
    try {
       
       const {id,fileName,fileURL,studentid}=req;
    
       const assi= await Assignment.findOne({_id:id});
       if(!assi.uploads){
        assi.uploads=[]
      }

      const stuID =new mongoose.Types.ObjectId(studentid);
      assi.uploads.push({
        studentId:stuID,
        filename:fileName,
        fileUrl:fileURL,
        submissionDate:new Date(),
      })
      await assi.save();
       console.log(assi,"assignment added");
       return assi;
    } catch (error) {
      console.log('Error in crteating assignment', error);
    }
  };

  export const getAssigment = async (req) => {
    await connect();
    try {
        const id=req.id;
        const as=await Assignment.find({courseId:id});
        return as;
    } catch (error) {
      console.log('Error in crteating assignment', error);
    }
  };

  export const delStudent = async (req) => {
    await connect();
    try {
        const {assID,stid}=req;
        const as=await Assignment.findOne({_id:assID});
        // console.log(as,"assignment");
        // console.log(as[0].uploads,"assignment added");
        const filteredFiles = as.uploads.filter(file => file.studentId.toString() !== stid);
        as.uploads=filteredFiles;
        await as.save();
        console.log(filteredFiles,"assignment");
        return as;
    } catch (error) {
      console.log('Error in crteating assignment', error);
    }
  };
