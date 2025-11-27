import User from "../models/userSchema.js";
import Submission from "../models/submissionSchema.js";
import Problem from "../models/problemSchema.js";
import bcrypt from "bcrypt";
import cloudinary from "../config/cloudinary.js";

// Get user profile with detailed statistics
const getUserProfile = async (req, res) => {
  try {
    let userId;
    const { username } = req.query;

    if (username) {
      const userByUsername = await User.findOne({ username });
      if (!userByUsername) {
        return res.status(404).json({ message: "User not found" });
      }
      userId = userByUsername._id;
    } else {
      userId = req.user._id;
    }

    const user = await User.findById(userId)
      .select("-password")
      .populate("problemsSolved", "title difficulty tags");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all submissions by user
    const submissions = await Submission.find({ userId })
      .populate("problemId", "title difficulty")
      .sort({ createdAt: -1 });

    // Get total problems for difficulty breakdown
    const allProblems = await Problem.find({});
    const totalEasy = allProblems.filter((p) => p.difficulty === "Easy").length;
    const totalMedium = allProblems.filter((p) => p.difficulty === "Medium").length;
    const totalHard = allProblems.filter((p) => p.difficulty === "Hard").length;

    // Calculate solved problems by difficulty
    const solvedProblems = user.problemsSolved || [];
    const easySolved = solvedProblems.filter((p) => p.difficulty === "Easy").length;
    const mediumSolved = solvedProblems.filter((p) => p.difficulty === "Medium").length;
    const hardSolved = solvedProblems.filter((p) => p.difficulty === "Hard").length;

    // Calculate Skills (Tags) grouped by difficulty
    const skillsByDifficulty = {
        Easy: {},
        Medium: {},
        Hard: {}
    };
    
    solvedProblems.forEach(problem => {
        if (problem.tags && Array.isArray(problem.tags) && problem.difficulty) {
            const difficulty = problem.difficulty;
            if (skillsByDifficulty[difficulty]) {
                problem.tags.forEach(tag => {
                    skillsByDifficulty[difficulty][tag] = (skillsByDifficulty[difficulty][tag] || 0) + 1;
                });
            }
        }
    });

    // Convert to sorted arrays
    const skills = {
        Easy: Object.entries(skillsByDifficulty.Easy)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count),
        Medium: Object.entries(skillsByDifficulty.Medium)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count),
        Hard: Object.entries(skillsByDifficulty.Hard)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
    };

    // Calculate language statistics
    const languageStats = {};
    const acceptedSubmissions = submissions.filter((s) => s.status === "Accepted");
    
    acceptedSubmissions.forEach((sub) => {
      const lang = sub.language;
      if (!languageStats[lang]) {
        languageStats[lang] = 0;
      }
      languageStats[lang]++;
    });

    // Group ALL submissions by date for activity calendar (for frontend to filter)
    const allSubmissionsByDate = {};
    submissions.forEach((sub) => {
      const date = new Date(sub.createdAt).toISOString().split("T")[0];
      if (!allSubmissionsByDate[date]) {
        allSubmissionsByDate[date] = 0;
      }
      allSubmissionsByDate[date]++;
    });

    // Calculate submission activity for stats (based on year filter if provided)
    const { year } = req.query;
    let startDate, endDate;
    let submissionsForStats;

    if (year) {
        startDate = new Date(`${year}-01-01T00:00:00.000Z`);
        endDate = new Date(`${year}-12-31T23:59:59.999Z`);
        submissionsForStats = submissions.filter(
          (s) => {
              const d = new Date(s.createdAt);
              return d >= startDate && d <= endDate;
          }
        );
    } else {
        // Default: last 365 days
        const today = new Date();
        endDate = today;
        startDate = new Date(today);
        startDate.setFullYear(startDate.getFullYear() - 1);
        submissionsForStats = submissions.filter(
          (s) => {
              const d = new Date(s.createdAt);
              return d >= startDate && d <= endDate;
          }
        );
    }

    // Group submissions by date for stats calculation
    const submissionsByDateForStats = {};
    submissionsForStats.forEach((sub) => {
      const date = new Date(sub.createdAt).toISOString().split("T")[0];
      if (!submissionsByDateForStats[date]) {
        submissionsByDateForStats[date] = 0;
      }
      submissionsByDateForStats[date]++;
    });

    // Calculate streaks (using all submissions, not filtered)
    const allSortedDates = Object.keys(allSubmissionsByDate).sort();
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 1;

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    // Check if user submitted today or yesterday for current streak
    if (allSubmissionsByDate[today] || allSubmissionsByDate[yesterday]) {
      let checkDate = allSubmissionsByDate[today] ? new Date() : new Date(Date.now() - 86400000);
      
      while (true) {
        const dateStr = checkDate.toISOString().split("T")[0];
        if (allSubmissionsByDate[dateStr]) {
          currentStreak++;
          checkDate = new Date(checkDate.getTime() - 86400000);
        } else {
          break;
        }
      }
    }

    // Calculate max streak
    for (let i = 1; i < allSortedDates.length; i++) {
      const prevDate = new Date(allSortedDates[i - 1]);
      const currDate = new Date(allSortedDates[i]);
      const diffDays = Math.round((currDate - prevDate) / 86400000);

      if (diffDays === 1) {
        tempStreak++;
      } else {
        maxStreak = Math.max(maxStreak, tempStreak);
        tempStreak = 1;
      }
    }
    maxStreak = Math.max(maxStreak, tempStreak);

    // Get recent accepted submissions for display
    const recentAccepted = acceptedSubmissions
      .slice(0, 10)
      .map((sub) => ({
        _id: sub._id,
        problemTitle: sub.problemId?.title || "Unknown",
        problemId: sub.problemId?._id,
        language: sub.language,
        runTime: sub.runTime,
        memory: sub.memory,
        createdAt: sub.createdAt,
      }));

    // Calculate total active days (for the filtered period)
    const activeDays = Object.keys(submissionsByDateForStats).length;
    
    // Calculate total submissions for the selected period
    const totalSubmissionsInPeriod = submissionsForStats.length;

    // Prepare response
    const profileData = {
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName || "",
        username: user.username,
        email: user.emailId,
        secondaryEmails: user.secondaryEmails || [],
        role: user.role,
        createdAt: user.createdAt,
        gender: user.gender,
        location: user.location,
        birthday: user.birthday,
        summary: user.summary,
        website: user.website,
        github: user.github,
        linkedin: user.linkedin,
        twitter: user.twitter,
        avatar: user.avatar || ""
      },
      stats: {
        totalSolved: solvedProblems.length,
        totalProblems: allProblems.length,
        easySolved,
        mediumSolved,
        hardSolved,
        totalEasy,
        totalMedium,
        totalHard,
        totalSubmissions: totalSubmissionsInPeriod,
        acceptedSubmissions: acceptedSubmissions.length,
        activeDays,
        currentStreak,
        maxStreak,
      },
      skills,
      languageStats,
      submissionCalendar: allSubmissionsByDate, // Send ALL submissions for frontend filtering
      recentAccepted,
    };

    return res.status(200).json(profileData);
  } catch (error) {
    console.error("Get user profile error:", error);
    return res.status(500).json({ message: "Failed to get user profile" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      firstName,
      lastName,
      username,
      email,
      gender,
      location,
      birthday,
      summary,
      website,
      github,
      linkedin,
      twitter,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check username uniqueness if being updated
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
      user.username = username;
    }

    // Check email uniqueness if being updated
    if (email && email !== user.emailId) {
      const existingEmail = await User.findOne({ emailId: email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.emailId = email;
    }

    if (firstName) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (gender !== undefined) user.gender = gender;
    if (location !== undefined) user.location = location;
    if (birthday !== undefined) user.birthday = birthday;
    if (summary !== undefined) user.summary = summary;
    if (website !== undefined) user.website = website;
    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (twitter !== undefined) user.twitter = twitter;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.emailId,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Failed to update profile" });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Check if new password is same as current password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: "New password must be different from current password" });
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ message: "Failed to change password" });
  }
};

// Delete account
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete user's avatar from cloudinary if exists
    const user = await User.findById(userId);
    if (user?.avatar) {
      const publicId = user.avatar.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`algoforge/avatars/${publicId}`);
    }

    // Delete user's submissions
    await Submission.deleteMany({ userId });

    // Delete user account
    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    return res.status(500).json({ message: "Failed to delete account" });
  }
};

// Upload avatar
const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete old avatar from cloudinary if exists
    if (user.avatar) {
      try {
        const publicId = user.avatar.split('/').pop().split('.')[0];
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
            { quality: "auto" }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Update user avatar URL
    user.avatar = result.secure_url;
    await user.save();

    return res.status(200).json({
      message: "Avatar uploaded successfully",
      avatar: result.secure_url
    });
  } catch (error) {
    console.error("Upload avatar error:", error);
    return res.status(500).json({ message: "Failed to upload avatar" });
  }
};

// Remove avatar
const removeAvatar = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.avatar) {
      return res.status(400).json({ message: "No avatar to remove" });
    }

    // Delete avatar from cloudinary
    try {
      const publicId = user.avatar.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`algoforge/avatars/${publicId}`);
    } catch (err) {
      console.error("Error deleting avatar from cloudinary:", err);
    }

    // Remove avatar URL from user
    user.avatar = "";
    await user.save();

    return res.status(200).json({ message: "Avatar removed successfully" });
  } catch (error) {
    console.error("Remove avatar error:", error);
    return res.status(500).json({ message: "Failed to remove avatar" });
  }
};

// Add secondary email
const addSecondaryEmail = async (req, res) => {
  try {
    const userId = req.user._id;
    const { email } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is same as primary
    if (email.toLowerCase() === user.emailId.toLowerCase()) {
      return res.status(400).json({ message: "This is already your primary email" });
    }

    // Check if email already exists in secondary emails
    if (user.secondaryEmails && user.secondaryEmails.includes(email.toLowerCase())) {
      return res.status(400).json({ message: "This email is already added" });
    }

    // Check if email is used by another user
    const existingUser = await User.findOne({ 
      $or: [
        { emailId: email.toLowerCase() },
        { secondaryEmails: email.toLowerCase() }
      ]
    });
    if (existingUser && existingUser._id.toString() !== userId.toString()) {
      return res.status(400).json({ message: "This email is already in use by another account" });
    }

    // Add to secondary emails
    if (!user.secondaryEmails) {
      user.secondaryEmails = [];
    }
    user.secondaryEmails.push(email.toLowerCase());
    await user.save();

    return res.status(200).json({ 
      message: "Secondary email added successfully",
      secondaryEmails: user.secondaryEmails
    });
  } catch (error) {
    console.error("Add secondary email error:", error);
    return res.status(500).json({ message: "Failed to add secondary email" });
  }
};

// Remove secondary email
const removeSecondaryEmail = async (req, res) => {
  try {
    const userId = req.user._id;
    const { email } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.secondaryEmails || !user.secondaryEmails.includes(email.toLowerCase())) {
      return res.status(400).json({ message: "Email not found in your secondary emails" });
    }

    // Remove from secondary emails
    user.secondaryEmails = user.secondaryEmails.filter(e => e !== email.toLowerCase());
    await user.save();

    return res.status(200).json({ 
      message: "Secondary email removed successfully",
      secondaryEmails: user.secondaryEmails
    });
  } catch (error) {
    console.error("Remove secondary email error:", error);
    return res.status(500).json({ message: "Failed to remove secondary email" });
  }
};

// Change primary email (swap with secondary)
const changePrimaryEmail = async (req, res) => {
  try {
    const userId = req.user._id;
    const { newPrimaryEmail } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newPrimaryEmail || !emailRegex.test(newPrimaryEmail)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the new primary email is in secondary emails
    if (!user.secondaryEmails || !user.secondaryEmails.includes(newPrimaryEmail.toLowerCase())) {
      return res.status(400).json({ message: "Email must be one of your secondary emails" });
    }

    // Swap: old primary becomes secondary, new becomes primary
    const oldPrimary = user.emailId;
    user.secondaryEmails = user.secondaryEmails.filter(e => e !== newPrimaryEmail.toLowerCase());
    user.secondaryEmails.push(oldPrimary);
    user.emailId = newPrimaryEmail.toLowerCase();
    await user.save();

    return res.status(200).json({ 
      message: "Primary email changed successfully",
      email: user.emailId,
      secondaryEmails: user.secondaryEmails
    });
  } catch (error) {
    console.error("Change primary email error:", error);
    return res.status(500).json({ message: "Failed to change primary email" });
  }
};

export { 
  getUserProfile, 
  updateUserProfile, 
  changePassword, 
  deleteAccount, 
  uploadAvatar, 
  removeAvatar,
  addSecondaryEmail,
  removeSecondaryEmail,
  changePrimaryEmail
};
