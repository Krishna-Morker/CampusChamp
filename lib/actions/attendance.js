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

export const getStudentPercentage = async (req) => {
  await connect();
  try {
    const courseId = req.id;
    // console.log(courseId);

    const courseAttendance = await Attendance.find({ courseId: courseId });
    // console.log(courseAttendance);

    const attendanceData = courseAttendance.reduce((acc, record) => {
      const { studentId, status } = record;
    
      // Initialize a student's record if not already done
      if (!acc[studentId]) {
        acc[studentId] = { studentId, total: 0, present: 0 };
      }
    
      // Update the total count and present count for each student
      acc[studentId].total += 1;
      if (status === 'Present') {
        acc[studentId].present += 1;
      }
    
      return acc;
    }, {});
    
    // Convert the attendanceData object to an array and calculate percentages
    const attendancePercentage = Object.values(attendanceData).map(studentData => {
      const { studentId, total, present } = studentData;
      const percentage = (present / total) * 100;
    
      return {
        studentId,
        percentage: percentage.toFixed(2) // round to 2 decimal places
      };
    });    
    // console.log(attendancePercentage);

    const attendanceWithUserInfo = await Promise.all(
      attendancePercentage.map(async (record) => {
        const studentInfo = await User.findById(record.studentId).lean().exec();
        return {
          ...record,
          studentInfo, // This will contain user information from the User collection
        };
      })
    );

    // console.log(attendanceWithUserInfo);

    return attendanceWithUserInfo;
  }catch(error) {
    console.log('Error geting student percentage', error);
  }
};