import mongoose from "mongoose";
import { validationResult } from "express-validator";
import {
  addNewLesson,
  deleteLesson,
  getLesson,
  updateLesson,
} from "../services/lesson.service.js";
import { getCourse } from "../services/course.service.js";
import Course from "../models/course.schema.js";
import Lesson from "../models/lesson.schema.js";

export const createNewLesson = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: errors.array(),
    });
  }
  const { courseId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid course id" });
  }
  const { title, order, content, quidId, isFreePreview } = req.body;
  try {
    const isCourseExists = await getCourse(courseId);
    if (!isCourseExists) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    const newLesson = await addNewLesson({
      courseId,
      title,
      order,
      content,
      quidId,
      isFreePreview,
    });
    if (!newLesson) {
      return res
        .status(404)
        .json({ success: false, message: "error in lesson creation" });
    }
    isCourseExists.lessons.push(newLesson._id);
    await isCourseExists.save();
    return res.status(200).json({
      success: true,
      message: "Lesson created successfully",
      lesson: newLesson,
    });
  } catch (error) {
    console.log(`Error while creating new lesson: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getLessonById = async (req, res) => {
  const { courseId, lessonId } = req.params;
  if (
    !mongoose.Types.ObjectId.isValid(courseId) ||
    !mongoose.Types.ObjectId.isValid(lessonId)
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid course id" });
  }
  try {
    const course = await getCourse(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    const isLesson = course.lessons.find(
      (lesson) => lesson._id.toString() === lessonId
    );
    if (!isLesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not belongs to this course!",
      });
    }
    const lesson = await getLesson(lessonId);
    return res.status(200).json({
      success: true,
      message: "Lesson found",
      lesson,
    });
  } catch (error) {
    console.log(`Error while getting lesson by id: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateLessonById = async (req, res) => {
  const { courseId, lessonId } = req.params;
  if (
    !mongoose.Types.ObjectId.isValid(courseId) ||
    !mongoose.Types.ObjectId.isValid(lessonId)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid course id",
    });
  }
  const { title, order, content, isFreePreview } = req.body;
  try {
    const isCourse = await getCourse(courseId);
    if (!isCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    const isLesson = isCourse.lessons.find(
      (lesson) => lesson._id.toString() === lessonId
    );
    if (!isLesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not belongs to this course!",
      });
    }
    const updatedLesson = await updateLesson(lessonId, {
      title,
      order,
      content,
      isFreePreview,
    });
    if (!updateLesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Lesson updated successfully",
      lesson: updatedLesson,
    });
  } catch (error) {
    console.log(`Error while updating lesson: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteLessonById = async (req, res) => {
  const { courseId, lessonId } = req.params;
  if (
    !mongoose.Types.ObjectId.isValid(courseId) ||
    !mongoose.Types.ObjectId.isValid(lessonId)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid course id",
    });
  }
  try {
    const isCourse = await getCourse(courseId);
    if (!isCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    const isLesson = isCourse.lessons.find(
      (lesson) => lesson._id.toString() === lessonId
    );
    if (!isLesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not belongs to this course!",
      });
    }
    const deletedLesson = await deleteLesson(lessonId);
    if (!deletedLesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Lesson deleted successfully",
      lesson: deletedLesson,
    });
  } catch (error) {
    console.log(`Error while deleting lesson: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getLessonsByCourseId = async (req, res) => {
  const { courseId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid course id",
    });
  }
  try {
    const isCourse = await getCourse(courseId);
    if (!isCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Lessons found",
      total_lessons: isCourse.lessons.length,
      lessons: isCourse.lessons,
    });
  } catch (error) {
    console.log(`Error while getting lessons by course id: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getLessonDetail = async (req, res) => {
  const { courseId, lessonId } = req.params;
  if (
    !mongoose.Types.ObjectId.isValid(courseId) ||
    !mongoose.Types.ObjectId.isValid(lessonId)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid course id",
    });
  }
  try {
    const isCourse = await getCourse(courseId);
    if (!isCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    const isLesson = isCourse.lessons.find(
      (lesson) => lesson._id.toString() === lessonId
    );
    if (!isLesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not belongs to this course!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Lesson found",
      lesson: isLesson,
    });
  } catch (error) {
    console.log(`Error while getting lesson by id: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const uploadLessonAsset = async (req, res) => {
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
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }
  try {
    const course = await Course.findById(courseId).select("_id");
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    const lesson = await Lesson.findOne({ _id: lessonId, courseId });
    if (!lesson) {
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });
    }
    const uploaded = {
      public_id: req.file.filename,
      secure_url: `/uploads/${req.file.filename}`,
      bytes: req.file.size,
      resource_type: req.file.mimetype,
    };
    lesson.content.file = {
      publicId: uploaded.public_id,
      url: uploaded.secure_url,
      size: uploaded.bytes,
      mime: uploaded.resource_type,
    };
    await lesson.save();
    return res.status(200).json({
      success: true,
      message: "Asset uploaded successfully",
      lesson,
    });
  } catch (error) {
    console.log(`Error while uploading asset: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
