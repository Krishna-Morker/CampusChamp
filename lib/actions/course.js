import { connect } from '../mongodb/mongoose';
const mongoose = require('mongoose');
import Course from '../models/coursemodel';
import User from '../models/usermodel';

export const Addcourse = async (req) => {
    await connect();
    try {
        const { courseName, professorName, joinCode, id } = req;
            
        const pre = await Course.findOne({ CourseName: courseName });
        if (pre) {
            return "Course Already Exists";
        }

        const profID = new mongoose.Types.ObjectId(id);
        let cour = await Course.create({
            CourseName: courseName,
            ProfessorName: professorName,
            JoinCode: joinCode,
            ProfID: profID,
        });

        // Using findOne to get a single user document
        let user = await User.findOne({ _id: profID });
        if (!user) {
            console.error('User not found');
            return 'User not found';
        }

        if (!user.Courses) {
            user.Courses = []; // Initialize Courses if undefined
        }

        user.Courses.push(cour._id); // Add the course ID to the user's Courses array
        await user.save(); // Save the updated user document

        return "Course Created";
    } catch (error) {
        console.log('Error creating course:', error);
        return 'Error creating course';
    }
};

  export const Getcourse = async (id) => {
    await connect();
    try {
       // console.log(id,"get");
        const profID =new mongoose.Types.ObjectId(id);
        const use=await User.findOne({_id:profID})
       // console.log(user,"course");
        const course = await Course.find({ _id: { $nin: use.Courses} });
       return course;
    } catch (error) {
      console.log('Error deleting user:', error);
    }
  };

  export const Mycourse = async (id) => {
    await connect();
    try {
       // console.log(id,"get");
        const profID =new mongoose.Types.ObjectId(id);
        const use=await User.findOne({_id:profID})
       // console.log(user,"course");
       const user=[];
       await Promise.all(use.Courses.map(async (u) => {
         const df = await Course.findOne({ _id: u });
         user.push(df); 
       }));
      
       return user;
    } catch (error) {
      console.log('Error deleting user:', error);
    }
  };
  export const Addstudent = async (req) => {
    await connect();
    try {
       // console.log(id,"get");
       const {courseid,userid}=req;

        const use=await User.findOne({_id:userid})
        const course = await Course.findOne({ _id: courseid });

        use.Courses.push(course._id); // Add the course ID to the user's Courses array
        await use.save(); // Save the updated user document
        if(!course.students){
            course.students=[]; // Initialize Courses if undefined
        }
        course.students.push(use._id); // Add the course ID to the user's Courses array
        await course.save();


       return "Successfully Joined";
    } catch (error) {
      console.log('Error deleting user:', error);
    }
  };