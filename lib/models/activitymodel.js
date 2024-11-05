// models/Activity.js
import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,  // Make this optional if it's a single-user app
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);

export default Activity;