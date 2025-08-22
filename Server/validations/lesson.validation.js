import { body } from "express-validator";

export const createLessonValiadtion = [
  body("title").notEmpty().withMessage("Title is required"),
  body("order").notEmpty().withMessage("Order is required"),
  body("content.type").notEmpty().withMessage("Content type is required"),
];
