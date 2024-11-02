const mongoose = require("mongoose");


const coursesSchema = new mongoose.Schema({
    CourseName: {
        type: String,
        unique: true,
        required: true,
    },
    ProfID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    ProfessorName: {
        type: String,
        unique: true,
        required: true,
    },
    Description: {
        type: String,
        unique: true,
        required: true,
    },
    JoinCode: {
        type: String,
        required: true,
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId, // Reference to Student model
        ref: 'User', // The name of the model you're referencing
        default: [],
      }],
},{timestamps: true});

const Course = mongoose.models.Course || mongoose.model("Course", coursesSchema);

export default Course;