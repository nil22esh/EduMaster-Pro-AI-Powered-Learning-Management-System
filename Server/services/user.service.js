import User from "../models/user.schema.js";

export const userExists = async (email) => {
  const user = await User.findOne(email);
  return user;
};

export const createNewUser = async (userData) => {
  const newUser = await User.create(userData);
  return newUser;
};
