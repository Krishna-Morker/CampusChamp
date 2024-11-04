import { connect } from '../mongodb/mongoose';
const mongoose = require('mongoose');
import Course from '../models/coursemodel';
import User from '../models/usermodel';
import Assignment from '../models/assignmentmodel'
import Attendance from '../models/attendancemodel';

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
  
