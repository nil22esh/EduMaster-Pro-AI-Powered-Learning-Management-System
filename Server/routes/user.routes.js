import express from "express";
import isAuthenticated from "./../middlewares/auth.middleware.js";
import { isAdmin } from "./../middlewares/checkRole.middleware.js";
import {
  loginValidations,
  registerValidations,
} from "./../validations/user.validation.js";
import {
  deleteUser,
  forgotPassword,
  getAllUsers,
  getMyProfile,
  getUserById,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateUser,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/auth/register", registerValidations, registerUser);
userRouter.post("/auth/login", loginValidations, loginUser);
userRouter.get("/user/me", isAuthenticated, getMyProfile);
userRouter.get("/user/:id", isAuthenticated, isAdmin, getUserById);
userRouter.put("/user/:id", isAuthenticated, updateUser);
userRouter.get("/allusers", isAuthenticated, isAdmin, getAllUsers);
userRouter.delete("/user/:id", isAuthenticated, isAdmin, deleteUser);
userRouter.post("/auth/logout", isAuthenticated, logoutUser);
userRouter.post("/user/forgot-password", forgotPassword);
userRouter.post("/user/reset-password/:token", resetPassword);

export default userRouter;
