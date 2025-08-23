import mongoose, { mongo } from "mongoose";
import AttemptQuiz from "../models/quizAttempt.schema.js";
import Quiz from "./../models/quiz.schema.js";

export const startAttempt = async (req, res) => {
  const { quizId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(quizId)) {
    return res.status(400).json({ success: false, message: "Invalid quiz id" });
  }
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }
    const attempt = await AttemptQuiz.create({
      quizId,
      userId: req.user._id,
    });
    return res.status(200).json({
      success: true,
      message: "Attempt started successfully",
      attempt,
    });
  } catch (error) {
    console.log(`Error while starting attempt: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const submitAttempt = async (req, res) => {
  const { quizId } = req.params;
  const userId = req.user._id;
  const { answers, score, timeTaken } = req.body;
  if (!mongoose.Types.ObjectId.isValid(quizId)) {
    return res.status(400).json({ success: false, message: "Invalid quiz id" });
  }
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }
    const existingAttempt = await AttemptQuiz.findOne({
      quizId: quizId,
      userId: userId,
    });
    if (existingAttempt) {
      return res
        .status(400)
        .json({ success: false, message: "Quiz already attempted" });
    }
    const newAttempt = new AttemptQuiz({
      quizId,
      userId,
      answers,
      score,
      timeTaken: timeTaken || null,
      completedAt: new Date(),
    });
    await newAttempt.save();
    return res.status(201).json({
      success: true,
      message: "Quiz attempt submitted successfully",
      attempt: newAttempt,
    });
  } catch (error) {
    console.log(`Error while submitting attempt: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getAttemptsByUser = async (req, res) => {
  const userId = req.user._id;
  const { quizId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(quizId)) {
    return res.status(400).json({ success: false, message: "Invalid quiz id" });
  }
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }
    const attempts = await AttemptQuiz.find({ quizId, userId });
    return res.status(200).json({
      success: true,
      message: "Attempts found",
      count: attempts.length,
      attempts,
    });
  } catch (error) {
    console.log(`Error while getting attempts by user: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getAttemptById = async (req, res) => {
  const { attemptId, quizId } = req.params;
  if (
    !mongoose.Types.ObjectId.isValid(attemptId) ||
    !mongoose.Types.ObjectId.isValid(quizId)
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid attempt id" });
  }
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }
    const attempt = await AttemptQuiz.findById(attemptId);
    if (!attempt) {
      return res
        .status(404)
        .json({ success: false, message: "Attempt not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Attempt found", attempt });
  } catch (error) {
    console.log(`Error while getting attempt by id: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
