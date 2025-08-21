import express from "express";
import isAuthenticated from "./../middlewares/auth.middleware.js";
import {
  createCourse,
  deleteCourseById,
  getAllCourses,
  getAllPublishedCourses,
  getCourseById,
  getCourseBySlug,
  getInstructorCourses,
  incrementEnrollCount,
  publishCourseById,
  rateCourseById,
  searchCourses,
  unpublishCourseById,
  updateCourseById,
} from "../controllers/course.controller.js";
import { isAdmin, isInstructor } from "../middlewares/checkRole.middleware.js";

const courseRouter = express.Router();

courseRouter.post("/createcourse", isAuthenticated, isInstructor, createCourse);
courseRouter.get("/course/:courseId", isAuthenticated, getCourseById);
courseRouter.put(
  "/updatecourse/:courseId",
  isAuthenticated,
  isInstructor,
  updateCourseById
);
courseRouter.delete(
  "/deletecourse/:courseId",
  isAuthenticated,
  isInstructor,
  deleteCourseById
);
courseRouter.patch(
  "/course/:courseId/publish",
  isAuthenticated,
  isAdmin,
  publishCourseById
);
courseRouter.patch(
  "/course/:courseId/unpublish",
  isAuthenticated,
  isAdmin,
  unpublishCourseById
);
courseRouter.get(
  "/course/slug/:slug",
  isAuthenticated,
  isInstructor,
  getCourseBySlug
);
courseRouter.get("/searchcourses", isAuthenticated, searchCourses);
courseRouter.patch(
  "/course/:courseId/enroll",
  isAuthenticated,
  isInstructor,
  incrementEnrollCount
);
courseRouter.get(
  "/course/published/courses",
  isAuthenticated,
  isAdmin,
  getAllPublishedCourses
);
courseRouter.get(
  "/instructor/courses",
  isAuthenticated,
  isInstructor,
  getInstructorCourses
);
courseRouter.get("/allcourses", isAuthenticated, isAdmin, getAllCourses);
courseRouter.post(
  "/course/:courseId/ratecourse",
  isAuthenticated,
  rateCourseById
);

export default courseRouter;
