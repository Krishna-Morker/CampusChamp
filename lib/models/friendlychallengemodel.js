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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
  ],
  challengerScore: {
    type: Number,
    default: null, // Updated after submission
  },
  challengedScore: {
    type: Number,
    default: null, // Updated after submission
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

const FriendlyChallenge = mongoose.model("FriendlyChallenge", friendlyChallengeSchema);

module.exports = FriendlyChallenge;
