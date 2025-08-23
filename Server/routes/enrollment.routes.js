import express from "express";
import isAuthenticated from "../middlewares/auth.middleware.js";
import { isAdmin } from "./../middlewares/checkRole.middleware.js";
import {
  completeCourse,
  enrollCourse,
  getEnrollmentByCourse,
  getMyEnrolledCourses,
  updateCourseProgress,
} from "../controllers/enrollment.controller.js";

const enrollmentRouter = express.Router();

enrollmentRouter.post(
  "/courses/:courseId/enroll",
  isAuthenticated,
  enrollCourse
);
enrollmentRouter.get(
  "/courses/me/enrollments",
  isAuthenticated,
  getMyEnrolledCourses
);
enrollmentRouter.get(
  "/courses/:courseId/enrollment",
  isAuthenticated,
  isAdmin,
  getEnrollmentByCourse
);
enrollmentRouter.put(
  "/courses/:courseId/lessons/:lessonId/progress",
  isAuthenticated,
  updateCourseProgress
);
enrollmentRouter.put(
  "/courses/:courseId/complete",
  isAuthenticated,
  completeCourse
);

export default enrollmentRouter;
