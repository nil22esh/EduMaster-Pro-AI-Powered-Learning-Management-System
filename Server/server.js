import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import dbConnect from "./db/dbConnect.js";
import userRouter from "./routes/user.routes.js";

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

// creating application server
app.listen(port, () => {
  console.log(`${env} server is running on port ${port}`);
});
