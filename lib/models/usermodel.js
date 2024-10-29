const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
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
        required: true,
    },
    avatar:{
        type: String,
        required: true,
    },

},{timestamps: true});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;