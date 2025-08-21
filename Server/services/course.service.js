import Course from "../models/course.schema.js";

export const createNewCourse = async (courseData) => {
  const newCourse = await Course.create(courseData);
  return newCourse;
};

export const getCourse = async (courseId) => {
  const course = await Course.findById(courseId).populate("instructor");
  return course;
};

export const getUpdatedCourse = async (courseId, courseData) => {
  const updatedCourse = await Course.findByIdAndUpdate(courseId, courseData, {
    new: true,
  });
  return updatedCourse;
};

export const getDeletedCourse = async (courseId) => {
  const deletedCourse = await Course.findByIdAndDelete(courseId);
  return deletedCourse;
};

export const getPublishedCourse = (courseId) => {
  const publishedCourse = Course.findByIdAndUpdate(
    courseId,
    { isPublished: true },
    {
      new: true,
    }
  );
  return publishedCourse;
};

export const getUnpublishedCourse = (courseId) => {
  const unpublishedCourse = Course.findByIdAndUpdate(
    courseId,
    {
      isPublished: false,
    },
    {
      new: true,
    }
  );
  return unpublishedCourse;
};

export const coursesBySlug = async (slug) => {
  const course = await Course.findOne({ slug, isPublished: true })
    .populate("instructor", "name email")
    .lean();
  return course;
};

export const getSearchedCourses = async (query) => {
  const courses = await Course.find(
    { $text: { $search: query }, isPublished: true },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .populate("instructor", "name email")
    .lean();
  return courses;
};

export const getUpdatedEnrollCount = async (courseId) => {
  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    { $inc: { enrollCount: 1 } },
    { new: true }
  );
  return updatedCourse;
};

export const getCoursesByInstructor = async (instructorId) => {
  const courses = await Course.find({ instructor: instructorId });
  return courses;
};

export const getRatedCourse = async (courseId, rating, userId) => {
  const course = await Course.findById(courseId);
  if (!course) return null;

  const existingRating = course.ratings.users.find(
    (r) => r.userId.toString() === userId.toString()
  );

  if (existingRating) {
    existingRating.rating = rating;
  } else {
    course.ratings.users.push({ userId, rating });
    course.ratings.count = course.ratings.users.length;
  }

  const total = course.ratings.users.reduce((acc, r) => acc + r.rating, 0);
  course.ratings.avg = total / course.ratings.users.length;

  await course.save();
  return course;
};

export const getCourses = async () => {
  const courses = await Course.find({}).populate("instructor");
  return courses;
};

export const getPublishedCourses = async () => {
  const courses = await Course.find({ isPublished: true }).populate(
    "instructor"
  );
  return courses;
};
