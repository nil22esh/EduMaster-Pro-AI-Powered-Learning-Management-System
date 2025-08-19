import { Schema, model, Types } from "mongoose";
import bcrypt from "bcrypt";
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
      select: false,
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
  },
  { timestamps: true }
);

UserSchema.index({ name: "text", email: "text" });

UserSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
  return token;
};

const User = model("User", UserSchema);
export default User;
