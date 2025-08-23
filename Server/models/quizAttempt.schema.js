import { Schema, model, Types } from "mongoose";

const AttemptSchema = new Schema(
  {
    quizId: {
      type: Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    answers: [
      {
        qIndex: Number,
        selectedOptions: [Number],
        answerText: String,
        correct: Boolean,
      },
    ],
    score: { type: Number, min: 0 },
    startedAt: { type: Date, default: Date.now },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

AttemptSchema.index({ quiz: 1, student: 1 }, { unique: true });

const AttemptQuiz = model("Attempt", AttemptSchema);
export default AttemptQuiz;
