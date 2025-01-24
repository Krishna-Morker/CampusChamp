const mongoose = require('mongoose');

// Schema for the questions
const questionSchema = new mongoose.Schema({
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
});

// Create model for questions
const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);

export default Question;
