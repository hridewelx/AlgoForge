import User from "../../models/userSchema.js";
import Submission from "../../models/submissionSchema.js";
import Problem from "../../models/problemSchema.js";

/**
 * Get user profile with detailed statistics
 * @param {Object} params - Query parameters (username, year)
 * @param {string} userId - Current user ID from JWT
 * @returns {Object} - Profile data with stats
 */
export const getUserProfileData = async (params, userId) => {
  let targetUserId;
  const { username, year } = params;

  if (username) {
    const userByUsername = await User.findOne({ username });
    if (!userByUsername) {
      throw new Error("User not found");
    }
    targetUserId = userByUsername._id;
  } else {
    targetUserId = userId;
  }

  const user = await User.findById(targetUserId)
    .select("-password")
    .populate("problemsSolved", "title difficulty tags");

  if (!user) {
    throw new Error("User not found");
  }

  // Get all submissions by user
  const submissions = await Submission.find({ userId: targetUserId })
    .populate("problemId", "title difficulty")
    .sort({ createdAt: -1 });

  // Get total problems for difficulty breakdown
  const allProblems = await Problem.find({});
  const totalEasy = allProblems.filter((p) => p.difficulty === "Easy").length;
  const totalMedium = allProblems.filter(
    (p) => p.difficulty === "Medium"
  ).length;
  const totalHard = allProblems.filter((p) => p.difficulty === "Hard").length;

  // Calculate solved problems by difficulty
  const solvedProblems = user.problemsSolved || [];
  const easySolved = solvedProblems.filter(
    (p) => p.difficulty === "Easy"
  ).length;
  const mediumSolved = solvedProblems.filter(
    (p) => p.difficulty === "Medium"
  ).length;
  const hardSolved = solvedProblems.filter(
    (p) => p.difficulty === "Hard"
  ).length;

  // Calculate Skills (Tags) grouped by difficulty
  const skillsByDifficulty = { Easy: {}, Medium: {}, Hard: {} };

  solvedProblems.forEach((problem) => {
    if (problem.tags && Array.isArray(problem.tags) && problem.difficulty) {
      const difficulty = problem.difficulty;
      if (skillsByDifficulty[difficulty]) {
        problem.tags.forEach((tag) => {
          skillsByDifficulty[difficulty][tag] =
            (skillsByDifficulty[difficulty][tag] || 0) + 1;
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
      .sort((a, b) => b.count - a.count),
  };

  // Calculate language statistics
  const languageStats = {};
  const acceptedSubmissions = submissions.filter(
    (s) => s.status === "Accepted"
  );

  acceptedSubmissions.forEach((sub) => {
    const lang = sub.language;
    if (!languageStats[lang]) {
      languageStats[lang] = 0;
    }
    languageStats[lang]++;
  });

  // Group ALL submissions by date for activity calendar
  const allSubmissionsByDate = {};
  submissions.forEach((sub) => {
    const date = new Date(sub.createdAt).toISOString().split("T")[0];
    if (!allSubmissionsByDate[date]) {
      allSubmissionsByDate[date] = 0;
    }
    allSubmissionsByDate[date]++;
  });

  // Calculate submission activity for stats
  let startDate, endDate, submissionsForStats;

  if (year) {
    startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    endDate = new Date(`${year}-12-31T23:59:59.999Z`);
    submissionsForStats = submissions.filter((s) => {
      const d = new Date(s.createdAt);
      return d >= startDate && d <= endDate;
    });
  } else {
    const today = new Date();
    endDate = today;
    startDate = new Date(today);
    startDate.setFullYear(startDate.getFullYear() - 1);
    submissionsForStats = submissions.filter((s) => {
      const d = new Date(s.createdAt);
      return d >= startDate && d <= endDate;
    });
  }

  // Group submissions by date for stats
  const submissionsByDateForStats = {};
  submissionsForStats.forEach((sub) => {
    const date = new Date(sub.createdAt).toISOString().split("T")[0];
    if (!submissionsByDateForStats[date]) {
      submissionsByDateForStats[date] = 0;
    }
    submissionsByDateForStats[date]++;
  });

  // Calculate streaks
  const allSortedDates = Object.keys(allSubmissionsByDate).sort();
  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 1;

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // Check if user submitted today or yesterday for current streak
  if (allSubmissionsByDate[today] || allSubmissionsByDate[yesterday]) {
    let checkDate = allSubmissionsByDate[today]
      ? new Date()
      : new Date(Date.now() - 86400000);

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

  // Get recent accepted submissions
  const recentAccepted = acceptedSubmissions.slice(0, 10).map((sub) => ({
    _id: sub._id,
    problemTitle: sub.problemId?.title || "Unknown",
    problemId: sub.problemId?._id,
    language: sub.language,
    runTime: sub.runTime,
    memory: sub.memory,
    createdAt: sub.createdAt,
  }));

  const activeDays = Object.keys(submissionsByDateForStats).length;
  const totalSubmissionsInPeriod = submissionsForStats.length;

  return {
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
      avatar: user.avatar || "",
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
    submissionCalendar: allSubmissionsByDate,
    recentAccepted,
  };
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updates - Profile updates
 * @returns {Object} - Updated user data
 */
export const updateUserProfileData = async (userId, updates) => {
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
  } = updates;

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Check username uniqueness
  if (username && username !== user.username) {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new Error("Username already taken");
    }
    user.username = username;
  }

  // Check email uniqueness
  if (email && email !== user.emailId) {
    const existingEmail = await User.findOne({ emailId: email });
    if (existingEmail) {
      throw new Error("Email already in use");
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

  return {
    message: "Profile updated successfully",
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.emailId,
    },
  };
};
