export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(401)
      .json({
        success: false,
        message: "Unauthorized, You don't have admin access",
      });
  }
  next();
};

export const isInstructor = (req, res, next) => {
  if (req.user.role !== "instructor") {
    return res
      .status(401)
      .json({
        success: false,
        message: "Unauthorized, You don't have instructor access",
      });
  }
  next();
};
