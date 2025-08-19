import jwt from "jsonwebtoken";
import User from "../models/user.schema.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const user = await User.findById(decoded._id);
    req.user = user;
    next();
  } catch (error) {
    console.log(`Error while authenticating user: ${error.message}`);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export default isAuthenticated;
