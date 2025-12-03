import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../models/userSchema.js";
import validateInformation from "../../utils/validator.js";

/**
 * Register a new user with email/password
 * @param {Object} userData - User registration data
 * @returns {Object} - Created user and token
 */
export const registerUser = async (userData) => {
  validateInformation(userData);
  const { firstName, emailId, password, confirmPassword, username } = userData;

  // Validation
  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Invalid password");
  }
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }
  if (!username || username.length < 3) {
    throw new Error("Username must be at least 3 characters");
  }

  // Check if username exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error("Username already taken");
  }

  // Create user
  const hashedPassword = await bcrypt.hash(password, 11);
  const user = await User.create({
    ...userData,
    password: hashedPassword,
    role: "user",
  });

  // Generate token
  const token = jwt.sign(
    { _id: user._id, role: user.role, emailId: user.emailId },
    process.env.JWT_SECRET_KEY,
    { expiresIn: 60 * 60 }
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
    },
    token,
  };
};

/**
 * Login user with email/username and password
 * @param {string} identifier - Email or username
 * @param {string} password - User password
 * @returns {Object} - User data and token
 */
export const loginUser = async (identifier, password) => {
  if (!identifier || !password) {
    throw new Error("Please provide email/username and password");
  }

  const normalizedIdentifier = identifier.toLowerCase().trim();

  // Find user by email or username
  const user = await User.findOne({
    $or: [
      { emailId: normalizedIdentifier },
      { username: normalizedIdentifier },
      { secondaryEmails: normalizedIdentifier },
    ],
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  // Generate token
  const token = jwt.sign(
    { _id: user._id, role: user.role, emailId: user.emailId },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
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
    },
    token,
  };
};

/**
 * Check if user is authenticated
 * @param {Object} user - User object from JWT middleware
 * @returns {Object} - User data
 */
export const checkAuthentication = async (user) => {
  const fullUser = await User.findById(user._id).select("-password");

  if (!fullUser) {
    throw new Error("User not found");
  }

  return {
    user: {
      _id: fullUser._id,
      firstName: fullUser.firstName,
      lastName: fullUser.lastName,
      emailId: fullUser.emailId,
      username: fullUser.username,
      role: fullUser.role,
      avatar: fullUser.avatar,
      emailVerified: fullUser.emailVerified,
    },
  };
};
