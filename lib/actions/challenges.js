import { connect } from '../mongodb/mongoose';
const mongoose = require('mongoose');
import Course from '../models/coursemodel';
import User from '../models/usermodel';
import Assignment from '../models/assignmentmodel'
import Challenges from '../models/challengemodel';

export const Addchallenge = async (req) => {
    await connect();
    try {
       const {courseId,title,description,dueDate,urls,type}=req
       const assi= await Challenges.create({
        courseId: courseId,
        title: title,
        description:description,
        dueDate:dueDate,
        assignmenturl:urls,
        type:type,
       });

       await assi.save();
       return "Successfullt addedd Challenges";
    } catch (error) {
      console.log('Error in crteating Challenges', error);
    }
  };

  
  export const Addstudent = async (req) => {
    await connect();
    try {
       
       const {id,fileName,fileURL,studentid,type}=req;
    
       const assi= await Challenges.findOne({_id:id,type:type});
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


  
  export const getChallenges = async (req) => {
    await connect();
    try {
        const {id,type}=req;
        const as=await Challenges.find({courseId:id,type:type});
        return as;
    } catch (error) {
      console.log('Error in crteating assignment', error);
    }
  };

  export const delStudent = async (req) => {
    await connect();
    try {
        const {assID,type,stid}=req;
        const as=await Challenges.findOne({_id:assID});
        // console.log(as,"assignment");
        // console.log(as[0].uploads,"assignment added");
        const filteredFiles = as.uploads.filter(file => file.studentId.toString() !== stid);
        as.uploads=filteredFiles;
        await as.save();
        return as;
    } catch (error) {
      console.log('Error in crteating assignment', error);
    }
  };


  export const presentChallenges = async (req) => {
    await connect();
    try {
      const { id,type } = req;
      const as = await Challenges.findOne({ _id: id,type:type });
      const all = await Promise.all(as.uploads.map(async (e) => {
        const user = await User.findOne({ _id: e.studentId });
        return {
          user,
          fileUrl: e.fileUrl, // Assuming fileUrl is stored in the uploads array
          submissionDate:e.submissionDate,
          duedate:as.dueDate
        };
      }));
      return all;
    } catch (error) {
      console.log('Error in creating assignment', error);
    }
  };


  export const remChal = async (req) => {
    await connect();
    try {
      const { assignmentId,studentId,type } = req;
      const as = await Challenges.findOne({ _id: assignmentId,type:type });
      const filteredFiles = as.uploads.filter(file => file.studentId.toString() !== studentId);
      as.uploads=filteredFiles;
      await as.save();
      return "Successfully removed Assignment";
    } catch (error) {
      console.log('Error in removing Assignment', error);
    }
  };
  export const remChallenges = async (req) => {
    await connect();
    try {
      const {ASSID } = req;
  
      await Challenges.findOneAndDelete({ _id: ASSID });
      return "Successfully removed Assignment";
    } catch (error) {
      console.log('Error in removing Assignment', error);
    }
  };

  