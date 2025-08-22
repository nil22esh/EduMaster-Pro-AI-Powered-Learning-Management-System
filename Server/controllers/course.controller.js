import mongoose from "mongoose";
import { validationResult } from "express-validator";
import {
  coursesBySlug,
  createNewCourse,
  getCourse,
  getCourses,
  getCoursesByInstructor,
  getDeletedCourse,
  getPublishedCourse,
  getPublishedCourses,
  getRatedCourse,
  getSearchedCourses,
  getUnpublishedCourse,
  getUpdatedCourse,
  getUpdatedEnrollCount,
} from "../services/course.service.js";

export const createCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: errors.array(),
    });
  }
  const instructor = req.user.id;
  const {
    title,
    slug,
    lessons,
    description,
    category,
    thumbnailUrl,
    level,
    currency,
    language,
    lessonsCount,
    ratings,
    isPublished,
    version,
    meta,
    tags,
    price,
  } = req.body;
  try {
    const newCourse = await createNewCourse({
      instructor,
      title,
      slug,
      description,
      category,
      lessons,
      thumbnailUrl,
      level,
      currency,
      language,
      lessonsCount,
      ratings,
      isPublished,
      version,
      meta,
      tags,
      price,
    });
    return res.status(201).json({
      success: true,
      message: "Course created successfully!",
      course: newCourse,
    });
  } catch (error) {
    console.log(`Error while creating course: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getCourseById = async (req, res) => {
  const { courseId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
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
    return res
      .status(200)
      .json({ success: true, message: "Course found", course });
  } catch (error) {
    console.log(`Error while getting course by id: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateCourseById = async (req, res) => {
  const { courseId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid course id" });
  }
  const {
    title,
    slug,
    description,
    category,
    thumbnailUrl,
    level,
    currency,
    language,
    lessonsCount,
    ratings,
    isPublished,
    version,
    meta,
    tags,
    price,
  } = req.body;
  try {
    const updatedCourse = await getUpdatedCourse(courseId, {
      title,
      slug,
      description,
      category,
      thumbnailUrl,
      level,
      currency,
      language,
      lessonsCount,
      ratings,
      isPublished,
      version,
      meta,
      tags,
      price,
    });
    if (!updatedCourse) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Course updated successfully!",
      course: updatedCourse,
    });
  } catch (error) {
    console.log(`Error while updating course by id: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteCourseById = async (req, res) => {
  const { courseId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid course id" });
  }
  try {
    const deletedCourse = await getDeletedCourse(courseId);
    if (!deletedCourse) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      course: deletedCourse,
    });
  } catch (error) {
    console.log(`Error while deleting course by id: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

``;
export const publishCourseById = async (req, res) => {
  const { courseId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid course id" });
  }
  try {
    const publishedCourse = await getPublishedCourse(courseId);
    if (!publishedCourse) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Course published successfully",
      course: publishedCourse,
    });
  } catch (error) {
    console.log(`Error while publishing course by id: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const unpublishCourseById = async (req, res) => {
  const { courseId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid course id" });
  }
  try {
    const unpublishedCourse = await getUnpublishedCourse(courseId);
    if (!unpublishedCourse) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Course unpublished successfully",
      course: unpublishedCourse,
    });
  } catch (error) {
    console.log(`Error while unpublishing course by id: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getCourseBySlug = async (req, res) => {
  const { slug } = req.params;
  if (!slug || slug.trim().length < 3) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid course slug" });
  }
  try {
    const course = await coursesBySlug(slug);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Course found", course });
  } catch (error) {
    console.log(`Error while getting course by slug: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const searchCourses = async (req, res) => {
  const query = req.query;
  console.log(query);
  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Search keyword must be at least 2 characters long",
    });
  }
  try {
    const courses = await getSearchedCourses(query);
    if (!courses || courses.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Course found", courses });
  } catch (error) {
    console.log(`Error while searching course by keyword: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const incrementEnrollCount = async (req, res) => {
  const { courseId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid course id" });
  }
  try {
    const updatedCourse = await getUpdatedEnrollCount(courseId);
    return res.status(200).json({
      success: true,
      message: "Enroll count incremented",
      course: updatedCourse,
    });
  } catch (error) {
    console.log(`Error while incrementing enroll count: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getInstructorCourses = async (req, res) => {
  const { id } = req.user;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid instructor id" });
  }
  try {
    const courses = await getCoursesByInstructor(id);
    if (!courses || courses.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Courses not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Courses found", courses });
  } catch (error) {
    console.log(`Error while getting instructor courses: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const rateCourseById = async (req, res) => {
  const { courseId } = req.params;
  const { rating } = req.body;
  const userId = req.user?._id;
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: "Rating must be between 1 and 5",
    });
  }
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid course id" });
  }
  try {
    const ratedCourse = await getRatedCourse(courseId, rating, userId);
    if (!ratedCourse) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Course rated successfully",
      course: ratedCourse,
    });
  } catch (error) {
    console.log(`Error while rating course by id: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await getCourses();
    return res.status(200).json({
      success: true,
      message: "Courses found",
      total_courses: courses.length,
      courses,
    });
  } catch (error) {
    console.log(`Error while getting all courses: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllPublishedCourses = async (req, res) => {
  try {
    const courses = await getPublishedCourses();
    return res.status(200).json({
      success: true,
      message: "Courses found",
      total_courses: courses.length,
      courses,
    });
  } catch (error) {
    console.log(`Error while getting all published courses: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
