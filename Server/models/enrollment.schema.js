import { Schema, model, Types } from "mongoose";

const LessonProgressSchema = new Schema(
  {
    lesson: { type: Types.ObjectId, ref: "Lesson", required: true },
    completed: { type: Boolean, default: false },
    lastWatchedAt: { type: Date },
  },
  { _id: false }
);

const EnrollmentSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: Types.ObjectId,
      ref: "Course",
      required: true,
    },
    paymentId: { type: Types.ObjectId, ref: "Payment" },
    paymentStatus: {
      type: String,
      enum: ["free", "paid", "refunded", "failed"],
      default: "free",
      index: true,
    },
    purchasedAt: { type: Date, required: true, default: Date.now },
    progressSummary: {
      lessonsCompleted: { type: Number, default: 0 },
      lastLesson: { type: Types.ObjectId, ref: "Lesson" },
      percent: { type: Number, default: 0, min: 0, max: 100 },
    },
    progress: [LessonProgressSchema],
    lastAccessedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Enrollement = model("Enrollment", EnrollmentSchema);
export default Enrollement;
