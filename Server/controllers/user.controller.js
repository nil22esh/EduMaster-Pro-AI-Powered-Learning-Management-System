import mongoose from "mongoose";
import crypto from "crypto";
import { validationResult } from "express-validator";
import {
  createNewUser,
  findUserByToken,
  getAllStudents,
  getDeletedUser,
  getUpdatedUser,
  getUser,
  userExists,
} from "../services/user.service.js";
import User from "../models/user.schema.js";

export const registerUser = async (req, res) => {
  // check validations
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: errors.array(),
    });
  }
  const {
    name,
    email,
    password,
    role,
    avatar,
    bio,
    skills,
    courses,
    badges,
    points,
  } = req.body;
  try {
    // check if user already exists
    const isUserExists = await userExists({ email });
    if (isUserExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists, please login!",
      });
    }
    // create new user
    const newUser = await createNewUser({
      name,
      email,
      password,
      role,
      avatar,
      bio,
      skills,
      courses,
      badges,
      points,
    });
    const token = await newUser.generateAuthToken();
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
      token,
    });
  } catch (error) {
    console.log(`Error while registering user: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  // check validations
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: errors.array(),
    });
  }
  const { email, password } = req.body;
  try {
    // check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist, please register!",
      });
    }
    // check if password is correct
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password!",
      });
    }
    const token = await user.generateAuthToken();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
    });
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(`Error while logging in user: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid user id" });
  }
  try {
    const user = await getUser(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, message: "User found", user });
  } catch (error) {
    console.log(`Error while getting user by id: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getMyProfile = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await getUser(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, message: "User found", user });
  } catch (error) {
    console.log(`Error while getting user by id: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.user;
  const {
    name,
    email,
    password,
    role,
    avatar,
    bio,
    skills,
    courses,
    badges,
    points,
  } = req.body;
  try {
    const updatedUser = await getUpdatedUser(id, {
      name,
      email,
      password,
      role,
      avatar,
      bio,
      skills,
      courses,
      badges,
      points,
    });
    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log(`Error while updating user: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid user id" });
  }
  try {
    const deletedUser = await getDeletedUser(id);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    console.log(`Error while deleting user: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllStudents();
    return res.status(200).json({
      success: true,
      message: "Users found",
      total_students: users.length,
      users,
    });
  } catch (error) {
    console.log(`Error while getting all users: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    // check if user exists
    const user = await userExists({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const resetToken = await user.generateResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${process.env.FRONTEND_URL}/forgot-password/${resetToken}`;
    console.log(`Password reset link: ${resetUrl}`);
    return res.status(200).json({
      success: true,
      message: "Password reset link sent to email",
      resetUrl,
    });
  } catch (error) {
    console.log(`Error while forgot password: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Passwords do not match" });
  }
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await findUserByToken(hashedToken);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired reset token!",
      });
    }
    user.password = password;
    user.hashedToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password reset successfully, please login again!",
      user,
    });
  } catch (error) {
    console.log(`Error while reset password: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    if (!req.user)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized, please login again!" });
    res.clearCookie("token");
    return res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.log(`Error while logging out user: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
