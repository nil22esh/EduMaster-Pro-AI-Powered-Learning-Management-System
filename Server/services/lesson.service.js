import Lesson from "../models/lesson.schema.js";

export const addNewLesson = async (lessonData) => {
  const lesson = await Lesson.create(lessonData);
  return lesson;
};

export const getLesson = async (lessonId) => {
  const lesson = await Lesson.findById(lessonId);
  return lesson;
};

export const updateLesson = async (lessonId, lessonData) => {
  const lesson = await Lesson.findByIdAndUpdate(lessonId, lessonData, {
    new: true,
  });
  return lesson;
};

export const deleteLesson = async (lessonId) => {
  const lesson = await Lesson.findByIdAndDelete(lessonId);
  return lesson;
};
