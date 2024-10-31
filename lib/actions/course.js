import { connect } from '../mongodb/mongoose';
import Course from '../models/coursemodel';


export const Addcourse = async (req) => {
    await connect();
    try {
        const {courseName,professorName,joinCode} = req;
        const pre=await Course.findOne({CourseName:courseName});
        if(pre){
            return "Course Already Exists";
        }
        let cour=await Course.create({
            CourseName:courseName,
            ProfessorName:professorName,
            JoinCode:joinCode,
        });
        await cour.save();
        return "Course Created";
    } catch (error) {
      console.log('Error deleting user:', error);
    }
  };