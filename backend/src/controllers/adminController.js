import User from "../models/userSchema.js";
import Problem from "../models/problemSchema.js";
import Submission from "../models/submissionSchema.js";

// Get all users with pagination and filters
const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "", role = "", sortBy = "createdAt", order = "desc" } = req.query;
        
        const query = {};
        
        // Search by name, email, or username
        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { emailId: { $regex: search, $options: "i" } },
                { username: { $regex: search, $options: "i" } }
            ];
        }
        
        // Filter by role
        if (role) {
            query.role = role;
        }
        
        const sortOrder = order === "asc" ? 1 : -1;
        
        const users = await User.find(query)
            .select("-password")
            .sort({ [sortBy]: sortOrder })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        
        const total = await User.countDocuments(query);
        
        // Get submission counts for each user
        const usersWithStats = await Promise.all(users.map(async (user) => {
            const submissions = await Submission.countDocuments({ userId: user._id });
            const acceptedSubmissions = await Submission.countDocuments({ userId: user._id, status: "Accepted" });
            const uniqueProblemsSolved = await Submission.distinct("problemId", { userId: user._id, status: "Accepted" });
            
            return {
                ...user.toObject(),
                totalSubmissions: submissions,
                acceptedSubmissions,
                problemsSolved: uniqueProblemsSolved.length
            };
        }));
        
        res.status(200).json({
            users: usersWithStats,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

// Get user details by ID
const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Get user's submission history
        const submissions = await Submission.find({ userId })
            .populate("problemId", "title difficulty")
            .sort({ createdAt: -1 })
            .limit(20);
        
        // Get submission stats
        const totalSubmissions = await Submission.countDocuments({ userId });
        const acceptedSubmissions = await Submission.countDocuments({ userId, status: "Accepted" });
        const uniqueProblemsSolved = await Submission.distinct("problemId", { userId, status: "Accepted" });
        
        // Get language distribution
        const languageStats = await Submission.aggregate([
            { $match: { userId: user._id } },
            { $group: { _id: "$language", count: { $sum: 1 } } }
        ]);
        
        // Get difficulty distribution of solved problems
        const solvedProblemIds = await Submission.distinct("problemId", { userId, status: "Accepted" });
        const difficultyStats = await Problem.aggregate([
            { $match: { _id: { $in: solvedProblemIds } } },
            { $group: { _id: "$difficulty", count: { $sum: 1 } } }
        ]);
        
        res.status(200).json({
            user,
            stats: {
                totalSubmissions,
                acceptedSubmissions,
                problemsSolved: uniqueProblemsSolved.length,
                acceptanceRate: totalSubmissions > 0 ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(1) : 0,
                languageStats,
                difficultyStats
            },
            recentSubmissions: submissions
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch user details" });
    }
};

// Update user role
const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        
        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }
        
        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        ).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({ user, message: "User role updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update user role" });
    }
};

// Delete user (admin only)
const deleteUserByAdmin = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Don't allow deleting yourself
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: "Cannot delete your own account from admin panel" });
        }
        
        // Delete user's submissions
        await Submission.deleteMany({ userId });
        
        // Delete user
        await User.findByIdAndDelete(userId);
        
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete user" });
    }
};

// Get platform analytics
const getAnalytics = async (req, res) => {
    try {
        const { timeRange = "30" } = req.query;
        const daysAgo = parseInt(timeRange);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysAgo);
        
        console.log("Analytics request - timeRange:", timeRange, "startDate:", startDate);
        
        // Basic counts
        const totalUsers = await User.countDocuments();
        const totalProblems = await Problem.countDocuments();
        const totalSubmissions = await Submission.countDocuments();
        const acceptedSubmissions = await Submission.countDocuments({ status: "Accepted" });
        
        console.log("Counts - Users:", totalUsers, "Problems:", totalProblems, "Submissions:", totalSubmissions);
        
        // New users in time range
        const newUsers = await User.countDocuments({ createdAt: { $gte: startDate } });
        const newSubmissions = await Submission.countDocuments({ createdAt: { $gte: startDate } });
        
        // User growth over time (daily)
        const userGrowth = await User.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        // Submission trends over time
        const submissionTrends = await Submission.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { 
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        status: "$status"
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.date": 1 } }
        ]);
        
        // Process submission trends for chart
        const trendsMap = {};
        submissionTrends.forEach(item => {
            if (!trendsMap[item._id.date]) {
                trendsMap[item._id.date] = { date: item._id.date, total: 0, accepted: 0, failed: 0 };
            }
            trendsMap[item._id.date].total += item.count;
            if (item._id.status === "Accepted") {
                trendsMap[item._id.date].accepted += item.count;
            } else {
                trendsMap[item._id.date].failed += item.count;
            }
        });
        const processedTrends = Object.values(trendsMap);
        
        // Problems by difficulty
        const problemsByDifficulty = await Problem.aggregate([
            { $group: { _id: "$difficulty", count: { $sum: 1 } } }
        ]);
        
        // Problems by tag (top 10)
        const problemsByTag = await Problem.aggregate([
            { $unwind: "$tags" },
            { $group: { _id: "$tags", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);
        
        // Language usage distribution
        const languageDistribution = await Submission.aggregate([
            { $group: { _id: "$language", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        
        // Submission status distribution
        const statusDistribution = await Submission.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        
        // Top solved problems
        const topSolvedProblems = await Submission.aggregate([
            { $match: { status: "Accepted" } },
            { $group: { _id: "$problemId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "problems",
                    localField: "_id",
                    foreignField: "_id",
                    as: "problem"
                }
            },
            { $unwind: "$problem" }
        ]);
        
        // Most active users (by submissions)
        const mostActiveUsers = await Submission.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            { $group: { _id: "$userId", submissions: { $sum: 1 } } },
            { $sort: { submissions: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $project: {
                    _id: 1,
                    submissions: 1,
                    "user.firstName": 1,
                    "user.lastName": 1,
                    "user.username": 1,
                    "user.avatar": 1
                }
            }
        ]);
        
        // Average runtime by language
        const avgRuntimeByLanguage = await Submission.aggregate([
            { $match: { status: "Accepted", runTime: { $gt: 0 } } },
            { 
                $group: { 
                    _id: "$language", 
                    avgRuntime: { $avg: "$runTime" },
                    avgMemory: { $avg: "$memory" }
                } 
            },
            { $sort: { avgRuntime: 1 } }
        ]);
        
        // Peak activity hours (submissions by hour)
        const activityByHour = await Submission.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $hour: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        // Calculate growth rates
        const previousPeriodStart = new Date(startDate);
        previousPeriodStart.setDate(previousPeriodStart.getDate() - daysAgo);
        
        const previousNewUsers = await User.countDocuments({ 
            createdAt: { $gte: previousPeriodStart, $lt: startDate } 
        });
        const previousNewSubmissions = await Submission.countDocuments({ 
            createdAt: { $gte: previousPeriodStart, $lt: startDate } 
        });
        
        const userGrowthRate = previousNewUsers > 0 
            ? (((newUsers - previousNewUsers) / previousNewUsers) * 100).toFixed(1) 
            : newUsers > 0 ? 100 : 0;
        
        const submissionGrowthRate = previousNewSubmissions > 0 
            ? (((newSubmissions - previousNewSubmissions) / previousNewSubmissions) * 100).toFixed(1) 
            : newSubmissions > 0 ? 100 : 0;
        
        const responseData = {
            overview: {
                totalUsers,
                totalProblems,
                totalSubmissions,
                acceptedSubmissions,
                acceptanceRate: totalSubmissions > 0 ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(1) : 0,
                newUsers,
                newSubmissions,
                userGrowthRate,
                submissionGrowthRate
            },
            charts: {
                userGrowth,
                submissionTrends: processedTrends,
                problemsByDifficulty,
                problemsByTag,
                languageDistribution,
                statusDistribution,
                activityByHour,
                avgRuntimeByLanguage
            },
            topData: {
                topSolvedProblems,
                mostActiveUsers
            }
        };
        
        console.log("Analytics response overview:", JSON.stringify(responseData.overview, null, 2));
        console.log("User growth data:", JSON.stringify(userGrowth, null, 2));
        
        res.status(200).json(responseData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch analytics" });
    }
};

// Get real-time stats (for dashboard widgets)
const getRealTimeStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const [
            todaySubmissions,
            todayAccepted,
            todayNewUsers,
            activeUsers24h
        ] = await Promise.all([
            Submission.countDocuments({ createdAt: { $gte: today } }),
            Submission.countDocuments({ createdAt: { $gte: today }, status: "Accepted" }),
            User.countDocuments({ createdAt: { $gte: today } }),
            Submission.distinct("userId", { createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } })
        ]);
        
        // Recent activity feed
        const recentActivity = await Submission.find()
            .populate("userId", "firstName lastName username avatar")
            .populate("problemId", "title difficulty")
            .sort({ createdAt: -1 })
            .limit(10);
        
        res.status(200).json({
            today: {
                submissions: todaySubmissions,
                accepted: todayAccepted,
                newUsers: todayNewUsers,
                activeUsers: activeUsers24h.length
            },
            recentActivity
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch real-time stats" });
    }
};

// Get notifications for admin
const getNotifications = async (req, res) => {
    try {
        const notifications = [];
        
        // Get recent user registrations (last 24 hours)
        const recentUsers = await User.find({
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        })
        .select("firstName lastName username createdAt")
        .sort({ createdAt: -1 })
        .limit(5);
        
        recentUsers.forEach(user => {
            notifications.push({
                id: `user-${user._id}`,
                type: "user_registered",
                text: `New user registered: ${user.firstName} ${user.lastName || ''}`.trim(),
                subtext: `@${user.username}`,
                time: user.createdAt,
                unread: true
            });
        });
        
        // Get recent submissions (last 24 hours)
        const recentSubmissions = await Submission.find({
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        })
        .populate("userId", "firstName lastName username")
        .populate("problemId", "title")
        .sort({ createdAt: -1 })
        .limit(5);
        
        recentSubmissions.forEach(sub => {
            notifications.push({
                id: `sub-${sub._id}`,
                type: sub.status === "Accepted" ? "submission_accepted" : "submission_failed",
                text: `${sub.userId?.firstName || 'User'} ${sub.status === "Accepted" ? "solved" : "attempted"} "${sub.problemId?.title || 'a problem'}"`,
                subtext: `Status: ${sub.status}`,
                time: sub.createdAt,
                unread: sub.status === "Accepted"
            });
        });
        
        // Sort by time descending
        notifications.sort((a, b) => new Date(b.time) - new Date(a.time));
        
        // Calculate time ago for each notification
        const now = new Date();
        const notificationsWithTimeAgo = notifications.slice(0, 10).map(n => {
            const diff = now - new Date(n.time);
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(diff / 3600000);
            const days = Math.floor(diff / 86400000);
            
            let timeAgo;
            if (minutes < 1) timeAgo = "Just now";
            else if (minutes < 60) timeAgo = `${minutes}m ago`;
            else if (hours < 24) timeAgo = `${hours}h ago`;
            else timeAgo = `${days}d ago`;
            
            return { ...n, timeAgo };
        });
        
        res.status(200).json({
            notifications: notificationsWithTimeAgo,
            unreadCount: notificationsWithTimeAgo.filter(n => n.unread).length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch notifications" });
    }
};

// Get platform settings (for now, just return basic config)
const getPlatformSettings = async (req, res) => {
    try {
        // For now, return mock settings - in production, this would come from a settings collection
        const settings = {
            general: {
                platformName: "AlgoForge",
                platformDescription: "Master algorithms and data structures through practice",
                maintenanceMode: false,
                allowRegistrations: true,
                requireEmailVerification: false
            },
            limits: {
                maxSubmissionsPerDay: 100,
                maxCodeLength: 50000,
                submissionTimeout: 10,
                maxTestCases: 50
            },
            features: {
                aiAssistant: true,
                editorials: true,
                leaderboard: true,
                discussions: false,
                contests: false
            },
            languages: {
                enabled: ["c", "cpp", "java", "javascript", "python"],
                default: "cpp"
            }
        };
        
        res.status(200).json({ settings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch settings" });
    }
};

// Get system health
const getSystemHealth = async (req, res) => {
    try {
        const dbStats = await User.db.stats();
        
        res.status(200).json({
            status: "healthy",
            database: {
                connected: true,
                collections: dbStats.collections,
                dataSize: (dbStats.dataSize / (1024 * 1024)).toFixed(2) + " MB",
                storageSize: (dbStats.storageSize / (1024 * 1024)).toFixed(2) + " MB"
            },
            uptime: process.uptime(),
            memoryUsage: {
                heapUsed: (process.memoryUsage().heapUsed / (1024 * 1024)).toFixed(2) + " MB",
                heapTotal: (process.memoryUsage().heapTotal / (1024 * 1024)).toFixed(2) + " MB"
            },
            nodeVersion: process.version
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: "unhealthy",
            message: "Failed to fetch system health" 
        });
    }
};

export {
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUserByAdmin,
    getAnalytics,
    getRealTimeStats,
    getNotifications,
    getPlatformSettings,
    getSystemHealth
};
