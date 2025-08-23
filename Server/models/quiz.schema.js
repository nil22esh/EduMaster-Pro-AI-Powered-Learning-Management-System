import { Schema, model, Types } from "mongoose";

const QuizSchema = new Schema(
  {
    lessonId: {
      type: Types.ObjectId,
      ref: "Lesson",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    questions: [
      {
        type: {
          type: String,
          enum: ["mcq", "truefalse", "short"],
          default: "mcq",
        },
        prompt: {
          type: String,
          required: true,
        },
        options: [{ type: String }],
        correctAnswers: [{ type: String }],
        explanation: {
          type: String,
        },
      },
    ],
    timeLimitSec: {
      type: Number,
      default: 0,
    },
    generatedByAI: {
      type: Boolean,
      default: false,
    },
    version: {
      type: Number,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Quiz = model("Quiz", QuizSchema);
export default Quiz;
