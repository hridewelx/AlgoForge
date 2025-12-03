import bcrypt from "bcrypt";
import User from "../../models/userSchema.js";
import Submission from "../../models/submissionSchema.js";
import cloudinary from "../../config/cloudinary.js";

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Object} - Success message
 */
export const changeUserPassword = async (
  userId,
  currentPassword,
  newPassword
) => {
  if (!currentPassword || !newPassword) {
    throw new Error("Current and new password are required");
  }

  if (newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Verify current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  // Check if new password is same as current
  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    throw new Error("New password must be different from current password");
  }

  // Hash and save new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  return { message: "Password changed successfully" };
};

/**
 * Delete user account
 * @param {string} userId - User ID
 * @returns {Object} - Success message
 */
export const deleteUserAccount = async (userId) => {
  // Delete user's avatar from cloudinary if exists
  const user = await User.findById(userId);
  if (user?.avatar) {
    const publicId = user.avatar.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`algoforge/avatars/${publicId}`);
  }

  // Delete user's submissions
  await Submission.deleteMany({ userId });

  // Delete user account
  await User.findByIdAndDelete(userId);

  return { message: "Account deleted successfully" };
};
