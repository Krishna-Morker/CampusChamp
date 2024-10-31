import { connect } from '../mongodb/mongoose';
import Course from '../models/usermodel';


export const Addcourse = async (req) => {
    try {
        console.log(req.json);
     const {courseName,professorName,joinCode}=req.json();
    } catch (error) {
      console.log('Error deleting user:', error);
    }
  };