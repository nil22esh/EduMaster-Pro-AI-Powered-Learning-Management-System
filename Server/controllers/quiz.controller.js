import { validationResult } from "express-validator";
import mongoose from "mongoose";
import { getCourse } from "../services/course.service.js";
import Lesson from "../models/lesson.schema.js";
import Quiz from "../models/quiz.schema.js";
import Course from "../models/course.schema.js";
import openai from "../config/openai.config.js";

export const createQuiz = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: errors.array(),
    });
  }
  const { courseId, lessonId } = req.params;
  if (
    !mongoose.Types.ObjectId.isValid(courseId) ||
    !mongoose.Types.ObjectId.isValid(lessonId)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid course or lesson id",
    });
  }
  const { title, questions, timeLimitSec, generatedByAI, version, isActive } =
    req.body;
  try {
    const course = await Course.findById(courseId).populate("lessons");
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    const lesson = await Lesson.findOne({ _id: lessonId, courseId });
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not belongs to this course!",
      });
    }
    const newQuiz = await Quiz.create({
      title,
      questions,
      timeLimitSec,
      generatedByAI,
      version,
      lessonId,
      isActive,
    });
    if (!lesson.quizzes) {
      lesson.quizzes = [];
    }
    lesson.quizzes.push(newQuiz._id);
    await lesson.save();
    return res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      quiz: newQuiz,
    });
  } catch (error) {
    console.log(`Error while creating quiz: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateQuiz = async (req, res) => {
  const { courseId, lessonId, quizId } = req.params;
  if (
    !mongoose.Types.ObjectId.isValid(courseId) ||
    !mongoose.Types.ObjectId.isValid(lessonId) ||
    !mongoose.Types.ObjectId.isValid(quizId)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid course or lesson or quiz id",
    });
  }
  const { title, questions, timeLimitSec, generatedByAI, version, isActive } =
    req.body;
  try {
    const course = await getCourse(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    const lesson = await Lesson.findOne({ _id: lessonId, courseId });
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not belongs to this course!",
      });
    }
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      {
        $set: {
          title,
          questions,
          timeLimitSec,
          generatedByAI,
          version,
          isActive,
        },
      },
      { new: true, runValidators: true }
    );
    if (!updatedQuiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not belongs to this lesson!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      quiz: updatedQuiz,
    });
  } catch (error) {
    console.log(`Error while updating quiz: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteQuiz = async (req, res) => {
  const { courseId, lessonId, quizId } = req.params;
  if (
    !mongoose.Types.ObjectId.isValid(courseId) ||
    !mongoose.Types.ObjectId.isValid(lessonId) ||
    !mongoose.Types.ObjectId.isValid(quizId)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid course or lesson or quiz id",
    });
  }
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    const lesson = await Lesson.findOne({ _id: lessonId, courseId });
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not belongs to this course!",
      });
    }
    const quiz = await Quiz.findOne({ _id: quizId, lessonId });
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not belongs to this lesson!",
      });
    }
    const deletedQuiz = await Quiz.findByIdAndDelete(quizId);
    await Lesson.findByIdAndUpdate(lessonId, {
      $pull: { quizzes: quizId },
    });
    return res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
      quiz: deletedQuiz,
    });
  } catch (error) {
    console.log(`Error while deleting quiz: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getQuizzesByLessonId = async (req, res) => {
  const { courseId, lessonId } = req.params;
  if (
    !mongoose.Types.ObjectId.isValid(courseId) ||
    !mongoose.Types.ObjectId.isValid(lessonId)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid course or lesson id",
    });
  }
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    const lesson = await Lesson.findOne({ _id: lessonId, courseId });
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not belongs to this course!",
      });
    }
    const quizzes = await Quiz.find({ lessonId });
    return res.status(200).json({
      success: true,
      message: "Quizzes found",
      quizzes,
    });
  } catch (error) {
    console.log(`Error while getting quizzes by lesson id: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const generateAIQuiz = async (req, res) => {
  const { lessonId } = req.params;
  const { title, numQuestions = 5 } = req.body;
  if (!mongoose.Types.ObjectId.isValid(lessonId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid lesson id" });
  }
  try {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });
    }
    const prompt = `
    Generate ${numQuestions} quiz questions in JSON format for the lesson titled "${lesson.title}".
    Each question must have:
    - type: one of ["mcq", "truefalse", "short"]
    - prompt: the actual question
    - options: (only if type is "mcq") an array of options
    - correctAnswers: an array of correct answers
    - explanation: a short explanation

    Example JSON output:
    [
      {
        "type": "mcq",
        "prompt": "What is 2+2?",
        "options": ["2","3","4","5"],
        "correctAnswers": ["4"],
        "explanation": "2+2 equals 4."
      }
    ]
    `;
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // lightweight + cheaper
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });
    let aiContent = response.choices[0].message.content.trim();
    aiContent = aiContent.replace(/```json|```/g, "").trim();
    let parsedQuestions;
    try {
      parsedQuestions = JSON.parse(aiContent);
    } catch (err) {
      console.error("Error parsing AI response:", aiContent);
      return res.status(500).json({
        success: false,
        message: "Failed to parse AI-generated quiz",
      });
    }
    const newQuiz = await Quiz.create({
      lessonId,
      title: title || `AI-Generated Quiz for ${lesson.title}`,
      questions: parsedQuestions,
      generatedByAI: true,
    });
    return res.status(201).json({
      success: true,
      message: "AI Quiz generated successfully",
      quiz: newQuiz,
    });
  } catch (error) {
    console.log(`Error while generating AI quiz: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const toggleQuizActive = async (req, res) => {
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
    quiz.isActive = !quiz.isActive;
    await quiz.save();
    return res.status(200).json({
      success: true,
      message: `Quiz has been ${
        quiz.isActive ? "activated" : "deactivated"
      } successfully`,
      quiz,
    });
  } catch (error) {
    console.log(`Error while toggling quiz active state: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
