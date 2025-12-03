import User from "../../models/userSchema.js";

/**
 * Get all user profiles (admin only)
 * @returns {Array} - List of all users
 */
export const getAllProfiles = async () => {
  const users = await User.find({});
  return users;
};

/**
 * Set user as admin (admin only)
 * @param {string} userId - User ID to promote
 * @returns {Object} - Updated user
 */
export const setUserAsAdmin = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  user.role = "admin";
  await user.save();

  return {
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailId: user.emailId,
      username: user.username,
      role: user.role,
    },
    message: "User promoted to admin successfully",
  };
};

/**
 * Delete user (admin only)
 * @param {string} userId - User ID to delete
 * @returns {Object} - Success message
 */
export const deleteUserById = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return { message: "User deleted successfully" };
};
