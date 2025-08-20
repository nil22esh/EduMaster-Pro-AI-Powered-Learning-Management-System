import { Schema, model, Types } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
      index: true,
    },
    avatar: {
      publicId: String,
      url: String,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    skills: [{ type: String, trim: true }],
    courses: [{ type: Types.ObjectId, ref: "Course" }],
    badges: [{ type: Types.ObjectId, ref: "Badge" }],
    points: {
      type: Number,
      default: 0,
      index: true,
    },
    lastLoginAt: {
      type: Date,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

UserSchema.index({ name: "text", email: "text" });

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.methods.comparePassword = function (password) {
  const isMatch = bcrypt.compareSync(password, this.password);
  return isMatch;
};

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
  return token;
};

UserSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = model("User", UserSchema);
export default User;
