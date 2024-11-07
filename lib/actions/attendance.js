import { connect } from '../mongodb/mongoose';
const mongoose = require('mongoose');
import Course from '../models/coursemodel';
import User from '../models/usermodel';
import Assignment from '../models/assignmentmodel'
import Attendance from '../models/attendancemodel';
import pusher from './pusherConfig';

export const saveAttendance = async (req) => {
    await connect();
    try {
        const { courseId, attendanceStatus, date ,points } = req;
        const promises = Object.entries(attendanceStatus).map(async ([studentId, status]) => {
            const normalizedDate = new Date(date);
            normalizedDate.setHours(0, 0, 0, 0);
            if(status === "Present"){
              const user = await User.findOne({ _id: studentId });
              user.points = user.points + points;
              await user.save();
            }
          
            return await Attendance.create({
              courseId: courseId,
              studentId: studentId,
              status: status,
              date: normalizedDate,
            });
          
          return null; // Return null for Present status
        });
  
        // Wait for all promises to resolve
        await Promise.all(promises);
  
        return "Attendance submitted successfully";
      } catch (error) {
        console.error('Error submitting attendance:', error);
        return ""
      }
  };

  
export const saveStatus = async (req) => {
    await connect();
    try {
        const { courseId, date } = req;
        
        // Convert the date string to a Date object and set the time to midnight
        const normalizedDate = new Date(date);
        console.log(normalizedDate);
        normalizedDate.setHours(0, 0, 0, 0); // Set time to 00:00:00

        // Query the database for attendance records matching the courseId and normalized date
        const res = await Attendance.find({ 
            courseId: new mongoose.Types.ObjectId(courseId), // Ensure courseId is an ObjectId
            date: normalizedDate 
        }).select('status studentId'); // Corrected the select method to a single string
        
        const transformedResults = res.map(record => ({
         status: record.status, // Convert studentId to string
         studentId:record.studentId.toString()
        }));
       
        return transformedResults; 
    } catch (error) {
        console.error('Error checking attendance status:', error);
        return "";
    }
  };
  
export const getAttendance = async (req) => {
  await connect();
  try{
    const {courseId,userId} = req;
    // console.log(courseId,userId)

    const StudentAttendance= await Attendance.find({
      courseId: courseId,
      studentId: userId
    })

    // console.log(StudentAttendance)

    return StudentAttendance;
  }
  catch(error){
    console.log('Error in getting attendance',error);
    return "";
  }
}

export const Myattendance = async (req) => {
  await connect();
  try {
     // console.log(id,"get");
     const { id } = req;
      const profID =new mongoose.Types.ObjectId(id);
      const use=await User.findOne({_id:profID})
     // console.log(user,"course");
     const user=[];
    
await Promise.all(use.Courses.map(async (u) => {
    // Fetch course details
    const df = await Course.findOne({ _id: u });

    // Fetch attendance records for the user in this course
    const records = await Attendance.find({ courseId: u, studentId: id }); // Make sure to use the correct field names

    const totalClasses = records.length;
    const presentClasses = records.filter(record => record.status === 'Present').length;

    // Calculate attendance percentage
    const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0; // Avoid division by zero

    // Create a new object that includes course details and the attendance percentage
    const courseWithAttendance = {
        course: df,
        attendancePercentage: attendancePercentage.toFixed(2) // Format to two decimal places
    };

    // Push the new object into the user array
    user.push(courseWithAttendance);
}));
    
    
     return user;
  } catch (error) {
    console.log('Error getting course', error);
  }
};
