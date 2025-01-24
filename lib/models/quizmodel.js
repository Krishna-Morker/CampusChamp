import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    questions: [
        {
            question: { type: String, required: true },
            options: [{ type: String, required: true }],
            correctAnswer: { type: String, required: true },
        },
    ],
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number, // In minutes
        required: true,
    },
    attempts: [
        {
            studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            score: { type: Number },
            attemptedAt: { type: Date, default: Date.now },
        },
    ],
}, { timestamps: true });

// Ensure 'attempts' is optional and starts as an empty array
quizSchema.pre("save", function (next) {
    if (!this.attempts) {
        this.attempts = [];
    }
    next();
});

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);

export default Quiz;