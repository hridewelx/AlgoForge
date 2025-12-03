import User from "../../models/userSchema.js";
import cloudinary from "../../config/cloudinary.js";

/**
 * Upload user avatar
 * @param {string} userId - User ID
 * @param {Buffer} fileBuffer - Image file buffer
 * @returns {Object} - Avatar URL
 */
export const uploadUserAvatar = async (userId, fileBuffer) => {
  if (!fileBuffer) {
    throw new Error("No image file provided");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Delete old avatar from cloudinary if exists
  if (user.avatar) {
    try {
      const publicId = user.avatar.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`algoforge/avatars/${publicId}`);
    } catch (err) {
      console.error("Error deleting old avatar:", err);
    }
  }

  // Upload new avatar to cloudinary
  const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "algoforge/avatars",
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
          { quality: "auto" },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });

  // Update user avatar URL
  user.avatar = result.secure_url;
  await user.save();

  return {
    message: "Avatar uploaded successfully",
    avatar: result.secure_url,
  };
};

/**
 * Remove user avatar
 * @param {string} userId - User ID
 * @returns {Object} - Success message
 */
export const removeUserAvatar = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (!user.avatar) {
    throw new Error("No avatar to remove");
  }

  // Delete avatar from cloudinary
  try {
    const publicId = user.avatar.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`algoforge/avatars/${publicId}`);
  } catch (err) {
    console.error("Error deleting avatar from cloudinary:", err);
  }

  // Remove avatar URL from user
  user.avatar = "";
  await user.save();

  return { message: "Avatar removed successfully" };
};
