import { connect } from '../mongodb/mongoose';
const mongoose = require('mongoose');
import Course from '../models/coursemodel';
import User from '../models/usermodel';

export const Addcourse = async (req) => {
    await connect();
    try {
        const { courseName, professorName,description, joinCode, id } = req;

        const pre = await Course.findOne({ CourseName: courseName });
        if (pre) {
            return "Course Already Exists";
        }

        const profID = new mongoose.Types.ObjectId(id);
        let cour = await Course.create({
            CourseName: courseName,
            ProfessorName: professorName,
            Description: description,
            JoinCode: joinCode,
            ProfID: profID,
        });
          await cour.save();
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
      console.log('Error getting course:', error);
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
      console.log('Error getting course', error);
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
      console.log('Error Adding user:', error);
    }
  };

  export const Removestudent = async (req) => {
    await connect();
    try {
      const { courseid, userid } = req;
  
      const user = await User.findOne({ _id: userid });
      const course = await Course.findOne({ _id: courseid });
  
      // Ensure `user` and `course` exist before proceeding
      if (!user || !course) {
        return "User or course not found";
      }
  
      // Remove course from user's Courses array
      user.Courses = user.Courses.filter((e) => e.toString() !== courseid.toString());
  
      // Save changes to user document
      await user.save();
  
      // Initialize `students` array if it doesn't exist in course
      if (!course.students) {
        course.students = [];
      }
  
      // Remove user from course's students array
      course.students = course.students.filter((e) => e.toString() !== userid.toString());
  
      // Save changes to course document
      await course.save();
      return "Successfully Leaved";
    } catch (error) {
      console.log('Error Removing user:', error);
    }
  };
  
  export const DeletCourse = async (req) => {
    await connect();
    try {
      const { courseid, profid } = req;
  
      const use = await User.findOne({ _id: profid });
      const course = await Course.findOne({ _id: courseid });
  
      // Ensure `user` and `course` exist before proceeding
      if (!use || !course) {
        return "User or course not found";
      }
  
      
     course.students.map(async(e) => {
       const user = await User.findOne({ _id: e });
       user.Courses = user.Courses.filter((e) => e.toString() !== courseid.toString());
       await user.save()
     })
     use.Courses = use.Courses.filter((e) => e.toString() !== courseid.toString());
     await use.save();
     await course.deleteOne({ _id: courseid });
      return "Successfully Deleted Course";
    } catch (error) {
      console.log('Error Deleting Course', error);
    }
  };
  

  
