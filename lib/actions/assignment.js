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
        return as;
    } catch (error) {
      console.log('Error in crteating assignment', error);
    }
  };

 export const Absentass = async (req) => {
    await connect();
    try {
      const { id } = req;
      const as = await Assignment.findOne({ _id: id });
      const course = await Course.findOne({ _id: as.courseId });
      
      // Get list of student IDs who uploaded the assignment
      const all = as.uploads.map((e) => e.studentId.toString());
      // Get list of all student IDs in the course
      const al = course.students.map((e) => e.toString());
     
      // Find students in `al` who are not in `all`
      const difference = al.filter((studentId) => !all.includes(studentId));
      // Fetch user data for students who have not uploaded the assignment
      const users = await Promise.all(
        difference.map(async (e) => {
          const user = await User.findOne({ _id: e });
          if (!user) console.log(`User with ID ${e} not found`);
          return user;
        })
      );
      return users;
    } catch (error) {
      console.log('Error in retrieving absent students', error);
    }
  };
  
  export const presentAss = async (req) => {
    await connect();
    try {
      const { id } = req;
      const as = await Assignment.findOne({ _id: id });
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
  
  export const remAss = async (req) => {
    await connect();
    try {
      const { assignmentId,studentId } = req;
      const as = await Assignment.findOne({ _id: assignmentId });
      const filteredFiles = as.uploads.filter(file => file.studentId.toString() !== studentId);
      as.uploads=filteredFiles;
      await as.save();
      return "Successfully removed Assignment";
    } catch (error) {
      console.log('Error in removing Assignment', error);
    }
  };
  export const remAssignment = async (req) => {
    await connect();
    try {
      const {ASSID } = req;
  
      await Assignment.findOneAndDelete({ _id: ASSID });
      return "Successfully removed Assignment";
    } catch (error) {
      console.log('Error in removing Assignment', error);
    }
  };

  