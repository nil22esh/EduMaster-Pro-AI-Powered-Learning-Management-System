import express from "express";
import isAuthenticated from "./../middlewares/auth.middleware.js";
import {
  createNewLesson,
  deleteLessonById,
  getLessonById,
  getLessonDetail,
  getLessonsByCourseId,
  updateLessonById,
} from "../controllers/lesson.controller.js";
import { isInstructor } from "../middlewares/checkRole.middleware.js";
import { createLessonValiadtion } from "./../validations/lesson.validation.js";

const lessonRouter = express.Router();

lessonRouter.post(
  "/course/:courseId/createlesson",
  isAuthenticated,
  createLessonValiadtion,
  isInstructor,
  createNewLesson
);
lessonRouter.get(
  "/course/:courseId/lessons",
  isAuthenticated,
  isInstructor,
  getLessonsByCourseId
);
lessonRouter.get(
  "/course/:courseId/lessons/:lessonId",
  isAuthenticated,
  isInstructor,
  getLessonById
);
lessonRouter.put(
  "/course/:courseId/lessons/:lessonId",
  isAuthenticated,
  isInstructor,
  updateLessonById
);
lessonRouter.delete(
  "/course/:courseId/lessons/:lessonId",
  isAuthenticated,
  isInstructor,
  deleteLessonById
);
lessonRouter.get(
  "/course/:courseId/lessons/:lessonId",
  isAuthenticated,
  isInstructor,
  getLessonDetail
);

export default lessonRouter;
