import { connect } from "../mongodb/mongoose";
import Quiz from "../models/quizmodel"; // Assuming you have a Quiz model
import mongoose from "mongoose";

// Create Quiz
export const createQuiz = async (req) => {
  await connect();
  try {
    const { courseId, title, description, questions, startTime, endTime, duration } = req.body;

    // Validate the input data
    if (!courseId || !title || !questions || !startTime || !endTime || !duration) {
      throw new Error("All fields are required");
    }
    // Create a new quiz document
    const quiz = new Quiz({
      courseId,
      title,
      description,
      questions,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      duration,
    });

    // Save the quiz to the database
    await quiz.save();

    console.log("Quiz created successfully");
    return { message: "Quiz created successfully" };
  } catch (error) {
    console.error("Error in creating quiz", error);
    throw new Error("Error in creating quiz");
  }
};