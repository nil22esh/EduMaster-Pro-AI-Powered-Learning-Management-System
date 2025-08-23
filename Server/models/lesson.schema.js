import { Schema, model, Types } from "mongoose";

const LessonSchema = new Schema(
  {
    courseId: {
      type: Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      index: true,
    },
    content: {
      type: {
        type: String,
        enum: ["video", "pdf", "doc", "html", "audio"],
        required: true,
      },
      title: {
        type: String,
        trim: true,
      },
      durationSec: {
        type: Number,
        min: 0,
      },
      file: {
        publicId: String,
        url: String,
        size: Number,
        mime: String,
      },
    },
    quizzes: [
      {
        type: Types.ObjectId,
        ref: "Quiz",
      },
    ],
    isFreePreview: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

LessonSchema.index({ courseId: 1, order: 1 }, { unique: true });

const Lesson = model("Lesson", LessonSchema);
export default Lesson;
