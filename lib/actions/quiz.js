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

export const fetchQuizzes = async ({ courseId }) => {
  await connect();
  try {
    const quizzes = await Quiz.find({ courseId }).sort({ startTime: -1 });
    return quizzes;
  } catch (error) {
    console.error("Error in fetching quizzes", error);
    throw new Error("Error in fetching quizzes");
  }
};

export const fetchQuiz = async ({ quizId }) => {
  await connect();
  try {
    const quiz = await Quiz.findById(quizId);
    return quiz;
  } catch (error) {
    console.error("Error in fetching quiz", error);
    throw new Error("Error in fetching quiz");
  }
};

export const submitQuizAttempt = async (req) => {
  await connect();
  try {
    const {quizId,score,studentId}=req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      throw new Error("Quiz not found");
    }

    // Add the student's attempt to the quiz
    quiz.attempts.push({ studentId, score });
    await quiz.save();

    return { message: "Attempt submitted successfully." };
  } catch (error) {
    console.error("Error in submitting quiz attempt", error);
    throw new Error("Error in submitting quiz attempt");
  }
};

import User from "../models/usermodel"; // Import User model to fetch student data

// Fetch quiz results (with student details)
export const fetchQuizResults = async ({ quizId }) => {
  await connect();
  try {
    const quiz = await Quiz.findById(quizId).populate("attempts.studentId", "username email"); // Populate student details (name, email) from User model
    if (!quiz) {
      throw new Error("Quiz not found");
    }

    // Map over attempts to extract student data
    const attemptsWithDetails = quiz.attempts.map((attempt) => ({
      studentName: attempt.studentId.username,  // Add student name
      studentEmail: attempt.studentId.email,  // Add student email
      score: attempt.score,
      attemptedAt: attempt.attemptedAt,
    }));

    return { attempts: attemptsWithDetails,totalQuestions: quiz.questions.length };
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    throw new Error("Error fetching quiz results");
  }
};
