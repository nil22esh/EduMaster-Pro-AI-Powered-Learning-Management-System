import { body, check } from "express-validator";

export const createCourseValidations = [
  body("title")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),
  body("slug")
    .isLength({ min: 3 })
    .withMessage("Slug must be at least 3 characters long"),
  body("description")
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters long"),
  body("title").notEmpty().withMessage("Title is required"),
  body("slug").notEmpty().withMessage("Slug is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("thumbnailUrl").notEmpty().withMessage("Thumbnail URL is required"),
  body("price").isNumeric().withMessage("Price must be a number"),
];
