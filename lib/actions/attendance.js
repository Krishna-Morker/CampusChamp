import { connect } from '../mongodb/mongoose';
const mongoose = require('mongoose');
import Course from '../models/coursemodel';
import User from '../models/usermodel';
import Assignment from '../models/assignmentmodel'
import Attendance from '../models/attendancemodel';

export const saveAttendance = async (req) => {
    await connect();
    try {
        const { courseId, attendanceStatus, date } = req;
        const promises = Object.entries(attendanceStatus).map(async ([studentId, status]) => {
            const normalizedDate = new Date(date);
            normalizedDate.setHours(0, 0, 0, 0);
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
        });
        console.log(normalizedDate);
        // If no attendance records were found, return false
        if (res.length === 0) return false;

        // If records were found, return true
        return true;
    } catch (error) {
        console.error('Error checking attendance status:', error);
        return "";
    }
  };
  
