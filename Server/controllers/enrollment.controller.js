import mongoose from "mongoose";
import Course from "./../models/course.schema.js";
import Enrollement from "../models/enrollment.schema.js";

export const enrollCourse = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid course id" });
  }
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    const existingEnrollment = await Enrollement.findOne({
      userId,
      courseId,
    });
    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "User already enrolled in this course",
      });
    }
    const enrollment = new Enrollement({
      courseId,
      userId,
    });
    course.enrolledCount += 1;
    await course.save();
    await enrollment.save();
    return res
      .status(200)
      .json({ success: true, message: "Enrolled in the course successfully!" });
  } catch (error) {
    console.log(`Error while enrolling course: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getMyEnrolledCourses = async (req, res) => {
  const userId = req.user.id;
  try {
    const enrolledCourses = await Enrollement.find({ userId });
    return res.status(200).json({
      success: true,
      message: "Enrolled courses found",
      enrolledCourses,
    });
  } catch (error) {
    console.log(`Error while getting enrolled courses: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getEnrollmentByCourse = async (req, res) => {
  const { courseId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid course id" });
  }
  try {
    const course = Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    const enrolledCourses = await Enrollement.find({ courseId });
    return res.status(200).json({
      success: true,
      message: "Enrolled courses found",
      enrolledCourses,
    });
  } catch (error) {
    console.log(`Error while getting enrolled courses: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateCourseProgress = async (req, res) => {
  const { courseId, lessonId } = req.params;
  const userId = req.user.id;
  const { completedLectures } = req.body;
  if (
    !mongoose.Types.ObjectId.isValid(courseId) ||
    !mongoose.Types.ObjectId.isValid(lessonId)
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid course id or lesson id" });
  }
  try {
    const course = Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    const lessons = course.lessons.id(lessonId);
    if (!lessons) {
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });
    }
    const enrollment = await Enrollement.findOne({
      user: userId,
      course: courseId,
    });
    if (!enrollment) {
      return res
        .status(404)
        .json({ success: false, message: "User not enrolled in this course" });
    }
    const progressEntry = enrollment.progress.find(
      (p) => p.lesson.toString() === lessonId
    );
    if (progressEntry) {
      progressEntry.completedLectures = completedLectures;
      progressEntry.completed =
        progressEntry.completedLectures >= lesson.lectures.length;
    } else {
      enrollment.progress.push({
        lesson: lessonId,
        completedLectures,
        completed: completedLectures >= lesson.lectures.length,
      });
    }
    await enrollment.save();
    return res.status(200).json({
      success: true,
      message: "Course progress updated",
      enrollment,
    });
  } catch (error) {
    console.log(`Error while updating course progress: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const completeCourse = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid course id" });
  }
  try {
    const course = Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });
    if (!enrollment) {
      return res
        .status(404)
        .json({ success: false, message: "User not enrolled in this course" });
    }
    enrollment.progress = course.lessons.map((lesson) => ({
      lesson: lesson._id,
      completedLectures: lesson.lectures.length,
      completed: true,
    }));
    enrollment.completed = true;
    enrollment.completedAt = new Date();
    await enrollment.save();
    return res.status(200).json({
      success: true,
      message: "Course marked as completed",
      enrollment,
    });
  } catch (error) {
    console.log(`Error while updating course progress: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
