import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import dbConnect from "./db/dbConnect.js";
import userRouter from "./routes/user.routes.js";
import courseRouter from "./routes/course.routes.js";
import lessonRouter from "./routes/lesson.routes.js";
import quizRouter from "./routes/quiz.routes.js";

// configuring environment variables
dotenv.config();
// connecting to database
dbConnect();
// creating express app instance and varibles
const app = express();
const port = process.env.PORT || 8080;
const env = process.env.NODE_ENV || "development";

// application level middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// creating routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/lessons", lessonRouter);
app.use("/api/v1/quizzes", quizRouter);

// creating application server
app.listen(port, () => {
  console.log(`${env} server is running on port ${port}`);
});
