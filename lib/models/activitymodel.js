// models/Activity.js
import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  description: [
    {
      title: { type: String, required: true },
      details: { type: String, required: true },
    },
  ],
});

const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);

export default Activity;