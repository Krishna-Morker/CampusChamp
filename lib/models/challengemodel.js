const mongoose = require("mongoose");

// Define the ChallengeType enum
const ChallengeType = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
};

const ChallengesSchema = new mongoose.Schema({
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  dueDate: { 
    type: Date, 
    required: true
  },
  type: {  // Add the type field for challenge categorization
    type: String,
    enum: Object.values(ChallengeType), // Use the enum values here
    required: true // Make this required if every challenge must have a type
  },
  assignmenturl: { 
    type: String, 
    required: true 
  },
  uploads: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      filename: { type: String, required: true },
      fileUrl: { type: String, required: true },
      submissionDate: { type: Date, default: Date.now }
    }
  ]
});

const Challenges = mongoose.models.Challenges || mongoose.model("Challenges", ChallengesSchema);

export default Challenges;
