import User from "../models/user.schema.js";

export const userExists = async (email) => {
  const user = await User.findOne(email);
  return user;
};

export const createNewUser = async (userData) => {
  const newUser = await User.create(userData);
  return newUser;
};

export const getUser = async (userId) => {
  const user = await User.findById(userId);
  return user;
};

export const getUpdatedUser = (userId, userData) => {
  const updatedUser = User.findByIdAndUpdate(userId, userData, { new: true });
  return updatedUser;
};

export const getDeletedUser = (userId) => {
  const deletedUser = User.findByIdAndDelete(userId);
  return deletedUser;
};

export const getAllStudents = async () => {
  const users = await User.find({ role: "student" });
  return users;
};

export const findUserByToken = (token) => {
  const user = User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() },
  }).select("+password");
  return user;
};
