import express from "express";
import isAuthenticated from "./../middlewares/auth.middleware.js";
import {
  getAttemptById,
  getAttemptsByUser,
  startAttempt,
  submitAttempt,
} from "../controllers/quizAttempt.controller.js";

const quizAttemptRouter = express.Router();

quizAttemptRouter.post("/quiz/:quizId/attempt", isAuthenticated, startAttempt);
quizAttemptRouter.post("/quiz/:quizId/submit", isAuthenticated, submitAttempt);
quizAttemptRouter.get(
  "/quiz/:quizId/attempts/me",
  isAuthenticated,
  getAttemptsByUser
);
quizAttemptRouter.get(
  "/quiz/:quizId/attempts/:attemptId",
  isAuthenticated,
  getAttemptById
);

export default quizAttemptRouter;
