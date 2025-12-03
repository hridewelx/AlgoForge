import User from "../../models/userSchema.js";

/**
 * Add secondary email
 * @param {string} userId - User ID
 * @param {string} email - Email to add
 * @returns {Object} - Updated secondary emails
 */
export const addSecondaryEmailService = async (userId, email) => {
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw new Error("Please provide a valid email address");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Check if email is same as primary
  if (email.toLowerCase() === user.emailId.toLowerCase()) {
    throw new Error("This is already your primary email");
  }

  // Check if email already exists in secondary emails
  if (
    user.secondaryEmails &&
    user.secondaryEmails.includes(email.toLowerCase())
  ) {
    throw new Error("This email is already added");
  }

  // Check if email is used by another user
  const existingUser = await User.findOne({
    $or: [
      { emailId: email.toLowerCase() },
      { secondaryEmails: email.toLowerCase() },
    ],
  });
  if (existingUser && existingUser._id.toString() !== userId.toString()) {
    throw new Error("This email is already in use by another account");
  }

  // Add to secondary emails
  if (!user.secondaryEmails) {
    user.secondaryEmails = [];
  }
  user.secondaryEmails.push(email.toLowerCase());
  await user.save();

  return {
    message: "Secondary email added successfully",
    secondaryEmails: user.secondaryEmails,
  };
};

/**
 * Remove secondary email
 * @param {string} userId - User ID
 * @param {string} email - Email to remove
 * @returns {Object} - Updated secondary emails
 */
export const removeSecondaryEmailService = async (userId, email) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (
    !user.secondaryEmails ||
    !user.secondaryEmails.includes(email.toLowerCase())
  ) {
    throw new Error("Email not found in your secondary emails");
  }

  // Remove from secondary emails
  user.secondaryEmails = user.secondaryEmails.filter(
    (e) => e !== email.toLowerCase()
  );
  await user.save();

  return {
    message: "Secondary email removed successfully",
    secondaryEmails: user.secondaryEmails,
  };
};

/**
 * Change primary email (swap with secondary)
 * @param {string} userId - User ID
 * @param {string} newPrimaryEmail - New primary email
 * @returns {Object} - Updated emails
 */
export const changePrimaryEmailService = async (userId, newPrimaryEmail) => {
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!newPrimaryEmail || !emailRegex.test(newPrimaryEmail)) {
    throw new Error("Please provide a valid email address");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Check if the new primary email is in secondary emails
  if (
    !user.secondaryEmails ||
    !user.secondaryEmails.includes(newPrimaryEmail.toLowerCase())
  ) {
    throw new Error("Email must be one of your secondary emails");
  }

  // Swap: old primary becomes secondary, new becomes primary
  const oldPrimary = user.emailId;
  user.secondaryEmails = user.secondaryEmails.filter(
    (e) => e !== newPrimaryEmail.toLowerCase()
  );
  user.secondaryEmails.push(oldPrimary);
  user.emailId = newPrimaryEmail.toLowerCase();
  await user.save();

  return {
    message: "Primary email changed successfully",
    email: user.emailId,
    secondaryEmails: user.secondaryEmails,
  };
};
