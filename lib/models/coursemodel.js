const mongoose = require("mongoose");


const coursesSchema = new mongoose.Schema({
    CourseName: {
        type: String,
        unique: true,
        required: true,
    },
    ProfessorName: {
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
        ref: 'Student', // The name of the model you're referencing
      }],
},{timestamps: true});

const Course = mongoose.models.Course || mongoose.model("Course", coursesSchema);

export default Course;