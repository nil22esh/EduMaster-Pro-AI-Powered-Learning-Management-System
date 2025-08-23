import express from "express";
import isAuthenticated from "./../middlewares/auth.middleware.js";
import {
  createQuiz,
  deleteQuiz,
  generateAIQuiz,
  getQuizzesByLessonId,
  toggleQuizActive,
  updateQuiz,
} from "../controllers/quiz.controller.js";
import { isInstructor } from "../middlewares/checkRole.middleware.js";
import { createQuizValidation } from "../validations/quiz.validation.js";

const quizRouter = express.Router();

quizRouter.post(
  "/course/:courseId/lesson/:lessonId/createquiz",
  isAuthenticated,
  createQuizValidation,
  isInstructor,
  createQuiz
);
quizRouter.put(
  "/course/:courseId/lesson/:lessonId/quiz/:quizId",
  isAuthenticated,
  isInstructor,
  updateQuiz
);
quizRouter.delete(
  "/course/:courseId/lesson/:lessonId/quiz/:quizId",
  isAuthenticated,
  isInstructor,
  deleteQuiz
);
quizRouter.get(
  "/course/:courseId/lesson/:lessonId/quizzes",
  isAuthenticated,
  isInstructor,
  getQuizzesByLessonId
);
quizRouter.post(
  "/generateaiquiz/:lessonId",
  isAuthenticated,
  isInstructor,
  generateAIQuiz
);
quizRouter.patch(
  "/quiz/:quizId/toggle",
  isInstructor,
  isAuthenticated,
  toggleQuizActive
);

export default quizRouter;
