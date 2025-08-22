import { Schema, model, Types } from "mongoose";

const CourseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      index: "text",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      min: 3,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      min: 20,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    instructor: {
      type: Types.ObjectId,
      ref: "User",
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    category: {
      type: String,
      index: true,
    },
    tags: [
      {
        type: String,
        index: true,
      },
    ],
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
      index: true,
    },
    language: {
      type: String,
      default: "en",
      index: true,
    },
    lessons: [
      {
        type: Types.ObjectId,
        ref: "Lesson",
      },
    ],
    lessonsCount: {
      type: Number,
      default: 0,
    },
    ratings: {
      avg: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
      users: [
        {
          userId: { type: Types.ObjectId, ref: "User" },
          rating: { type: Number, min: 1, max: 5 },
        },
      ],
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
    version: {
      type: Number,
      default: 1,
    },
    meta: {
      enrolledCount: {
        type: Number,
        default: 0,
        index: true,
      },
      totalDurationSec: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

CourseSchema.index({ title: "text", description: "text", tags: 1 });
CourseSchema.index({ instructor: 1, isPublished: 1 });
CourseSchema.index({
  category: 1,
  level: 1,
  price: 1,
});

const Course = model("Course", CourseSchema);
export default Course;
