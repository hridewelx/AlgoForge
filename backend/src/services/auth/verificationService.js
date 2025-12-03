import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/userSchema.js";
import redisClient from "../../config/redisDB.js";
import {
  sendVerificationEmail,
  generateVerificationCode,
  sendWelcomeEmail,
} from "../../utils/emailService.js";

// Redis prefixes
const PENDING_REGISTRATION_PREFIX = "pending_reg:";
const VERIFICATION_CODE_PREFIX = "verify_code:";

/**
 * Send verification code for signup
 * @param {Object} userData - User registration data
 * @returns {Object} - Success message and email
 */
export const sendSignupVerificationCode = async (userData) => {
  const { firstName, lastName, emailId, password, username } = userData;

  // Validate inputs
  if (!firstName || firstName.length < 2) {
    throw new Error("First name must be at least 2 characters");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email address");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
    );
  }
  if (!username || username.length < 3) {
    throw new Error("Username must be at least 3 characters");
  }

  const normalizedEmail = emailId.toLowerCase().trim();
  const normalizedUsername = username.toLowerCase().trim();

  // Check if email already exists
  const existingEmail = await User.findOne({
    $or: [{ emailId: normalizedEmail }, { secondaryEmails: normalizedEmail }],
  });
  if (existingEmail) {
    throw new Error("Email already registered");
  }

  // Check if username already exists
  const existingUsername = await User.findOne({ username: normalizedUsername });
  if (existingUsername) {
    throw new Error("Username already taken");
  }

  // Generate verification code
  const verificationCode = generateVerificationCode();

  // Store pending registration data in Redis (expires in 10 minutes)
  const pendingData = JSON.stringify({
    firstName,
    lastName: lastName || "",
    emailId: normalizedEmail,
    password: await bcrypt.hash(password, 11),
    username: normalizedUsername,
  });

  await redisClient.setEx(
    `${PENDING_REGISTRATION_PREFIX}${normalizedEmail}`,
    600,
    pendingData
  );
  await redisClient.setEx(
    `${VERIFICATION_CODE_PREFIX}${normalizedEmail}`,
    600,
    verificationCode
  );

  // Send verification email
  await sendVerificationEmail(normalizedEmail, verificationCode, firstName);

  return {
    message: "Verification code sent to your email",
    email: normalizedEmail,
  };
};

/**
 * Verify code and complete registration
 * @param {string} email - User email
 * @param {string} code - Verification code
 * @returns {Object} - User data and token
 */
export const verifyCodeAndRegister = async (email, code) => {
  if (!email || !code) {
    throw new Error("Email and verification code are required");
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Get stored verification code
  const storedCode = await redisClient.get(
    `${VERIFICATION_CODE_PREFIX}${normalizedEmail}`
  );

  if (!storedCode) {
    throw new Error("Verification code expired. Please request a new one.");
  }

  if (storedCode !== code) {
    throw new Error("Invalid verification code");
  }

  // Get pending registration data
  const pendingDataStr = await redisClient.get(
    `${PENDING_REGISTRATION_PREFIX}${normalizedEmail}`
  );

  if (!pendingDataStr) {
    throw new Error("Registration session expired. Please start again.");
  }

  const pendingData = JSON.parse(pendingDataStr);

  // Create user
  const user = await User.create({
    firstName: pendingData.firstName,
    lastName: pendingData.lastName,
    emailId: pendingData.emailId,
    password: pendingData.password,
    username: pendingData.username,
    role: "user",
    emailVerified: true,
  });

  // Clean up Redis
  await redisClient.del(`${PENDING_REGISTRATION_PREFIX}${normalizedEmail}`);
  await redisClient.del(`${VERIFICATION_CODE_PREFIX}${normalizedEmail}`);

  // Generate token
  const token = jwt.sign(
    { _id: user._id, role: user.role, emailId: user.emailId },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );

  // Send welcome email (don't await - send in background)
  sendWelcomeEmail(user.emailId, user.firstName, user.username).catch((err) =>
    console.error("Welcome email failed:", err)
  );

  return {
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailId: user.emailId,
      username: user.username,
      role: user.role,
      avatar: user.avatar,
      emailVerified: user.emailVerified,
    },
    token,
    message: "Registration successful! Welcome to AlgoForge.",
  };
};

/**
 * Resend verification code
 * @param {string} email - User email
 * @returns {Object} - Success message
 */
export const resendVerificationCodeService = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Check if there's a pending registration
  const pendingDataStr = await redisClient.get(
    `${PENDING_REGISTRATION_PREFIX}${normalizedEmail}`
  );

  if (!pendingDataStr) {
    throw new Error(
      "No pending registration found. Please start signup again."
    );
  }

  const pendingData = JSON.parse(pendingDataStr);

  // Generate new verification code
  const verificationCode = generateVerificationCode();

  // Update code in Redis (reset expiry)
  await redisClient.setEx(
    `${VERIFICATION_CODE_PREFIX}${normalizedEmail}`,
    600,
    verificationCode
  );

  // Send verification email
  await sendVerificationEmail(
    normalizedEmail,
    verificationCode,
    pendingData.firstName
  );

  return { message: "New verification code sent to your email" };
};
