import { validationResult } from "express-validator";
import { createNewUser, userExists } from "../services/user.service.js";

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

export const loginUser = async (req, res) => {};

export const getUserById = async (req, res) => {};

export const getMyProfile = async (req, res) => {};

export const updateUser = async (req, res) => {};

export const deleteUser = async (req, res) => {};

export const getAllUsers = async (req, res) => {};

export const forgotPassword = async (req, res) => {};

export const resetPassword = async (req, res) => {};

export const logoutUser = async (req, res) => {};
