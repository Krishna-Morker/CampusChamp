const mongoose = require("mongoose");

const friendlyChallengeSchema = new mongoose.Schema({
  challengerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  challengedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  topic: {
    type: String,
    required: true,
    enum: ["React", "Node", "Express", "Algorithms", "Data Structures", "Javascript", "DBMS", "HTML", "CSS", "OOPS", "Miscellaneous"], // Predefined topics
  },
  questions: [
    {
      topic: { type: String, required: true },
      question: { type: String, required: true },
      options: {
        type: [String],  // Array of options
        required: true
      },
      correctAnswer: {
        type: Number,  // Correct option index
        required: true
      }
    }
  ],
  challengerScore: {
    type: Number,
    default: 0, // Updated after submission
  },
  challengerResponses: {
    type: [{
      questionIndex: { type: Number, required: true },
      selectedOption: { type: Number, required: true }
    }],
    default: []
  },
  challengedScore: {
    type: Number,
    default: 0, // Updated after submission
  },
  challengedResponses: {
    type: [{
      questionIndex: { type: Number, required: true },
      selectedOption: { type: Number, required: true }
    }],
    default: []
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FriendlyChallenge = mongoose.models.FriendlyChallenge || mongoose.model("FriendlyChallenge", friendlyChallengeSchema);

module.exports = FriendlyChallenge;
