const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
      },
    lastName: {
        type: String,
        required: true,
      },
    username: {
        type: String,
    },
    avatar:{
        type: String,
        required: true,
    },
    prof:{
        type: Number,
        default:0,
    },
    points:{
        type: Number,
        default:0,
    },
    Courses: [{
        type: mongoose.Schema.Types.ObjectId, // Reference to Student model
        ref: 'Course', // The name of the model you're referencing
        default: [],
      }],
},{timestamps: true});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;