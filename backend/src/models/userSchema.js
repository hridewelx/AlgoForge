import mongoose from "mongoose";
import { Schema } from "mongoose";
import Submission from "./submissionSchema.js";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: [3, "First name must be at least 3 characters"],
      maxlength: [30, "First name cannot exceed 30 characters"],
      trim: true,
    },
    lastName: {
      type: String,
      minlength: [3, "Last name must be at least 3 characters"],
      maxlength: [30, "Last name cannot exceed 30 characters"],
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username cannot exceed 20 characters"],
      trim: true,
      lowercase: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    secondaryEmails: {
      type: [String],
      default: [],
      validate: {
        validator: function (emails) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emails.every((email) => emailRegex.test(email));
        },
        message: "Invalid email format in secondary emails",
      },
    },
    age: {
      type: Number,
      min: 5,
      max: 80,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    problemsSolved: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "problem",
        },
      ],
      default: [],
      unique: true,
    },
    password: {
      type: String,
      minLength: 8,
      // maxLength: 100,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },
    // OAuth providers
    providers: [
      {
        name: {
          type: String,
          enum: ["google", "github"],
        },
        providerId: String,
      },
    ],
    location: { type: String, default: "" },
    birthday: { type: Date },
    summary: { type: String, maxlength: 500, default: "" },
    website: { type: String, default: "" },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
    avatar: { type: String, default: "" },
    // Email verification
    emailVerified: { type: Boolean, default: false },
    // Password reset fields
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  {
    timestamps: true,
  }
);

userSchema.post("findOneAndDelete", async (userInfo) => {
  await Submission.deleteMany({ userId: userInfo._id }).exec();
});

const User = mongoose.model("user", userSchema);
export default User;
