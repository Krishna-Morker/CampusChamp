import { connect } from '../mongodb/mongoose';
const mongoose = require('mongoose');
import Course from '../models/coursemodel';


export const Addcourse = async (req) => {
    await connect();
    try {
        const {courseName,professorName,joinCode,id} = req;
        const pre=await Course.findOne({CourseName:courseName});
        if(pre){
            return "Course Already Exists";
        }
      
        const profID =new mongoose.Types.ObjectId(id); 
        // console.log(' ')
        // console.log(profID,"efwefwfwfwfwefwefewf");
        let cour=await Course.create({
            CourseName:courseName,
            ProfessorName:professorName,
            JoinCode:joinCode,
            ProfID:profID,
        });
       // console.log(cour,"con");
        await cour.save();
        return "Course Created";
    } catch (error) {
      console.log('Error deleting user:', error);
    }
  };