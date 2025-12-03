import crypto from "crypto";
import validator from "validator";
import bcrypt from "bcryptjs";
import User from "../../models/userSchema.js";
import { sendPasswordResetEmail } from "../../utils/emailService.js";

/**
 * Request password reset - send reset link via email
 * @param {string} email - User email
 * @returns {Object} - Success message
 */
export const requestPasswordResetService = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({
    $or: [{ emailId: normalizedEmail }, { secondaryEmails: normalizedEmail }],
  });

  const successMessage =
    "If an account with that email exists, we've sent a password reset link.";

  if (!user) {
    // Don't reveal if email exists for security
    return { message: successMessage };
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  try {
    await sendPasswordResetEmail(normalizedEmail, resetToken, user.username);
  } catch (emailError) {
    console.error("Failed to send password reset email:", emailError);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    throw new Error("Failed to send reset email. Please try again later.");
  }

  return { message: successMessage };
};

/**
 * Reset password using token
 * @param {string} token - Reset token
 * @param {string} password - New password
 * @returns {Object} - Success message
 */
export const resetPasswordService = async (token, password) => {
  if (!token || !password) {
    throw new Error("Token and password are required");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character"
    );
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error(
      "Invalid or expired reset token. Please request a new password reset."
    );
  }

  user.password = await bcrypt.hash(password, 11);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return {
    message:
      "Password reset successful. You can now log in with your new password.",
  };
};
