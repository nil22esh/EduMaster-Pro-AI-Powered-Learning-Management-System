import { body } from "express-validator";

export const createQuizValidation = [
  body("title")
    .isLength({ min: 5 })
    .withMessage("Title must be at least 5 characters long")
    .notEmpty()
    .withMessage("Title is required"),
  body("questions")
    .isArray({ min: 1 })
    .withMessage("At least one question is required"),
  body("questions.*.type")
    .isIn(["mcq", "truefalse", "short"])
    .withMessage("Invalid question type"),
  body("questions.*.prompt").isString().withMessage("Prompt is required"),
  body("questions.*.correctAnswers")
    .isArray()
    .withMessage("Correct answers must be an array"),
  body("questions.*.explanation")
    .isString()
    .withMessage("Explanation is required"),
];
