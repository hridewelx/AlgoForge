import express from "express";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import {
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUserByAdmin,
    getAnalytics,
    getRealTimeStats,
    getNotifications,
    getPlatformSettings,
    getSystemHealth
} from "../controllers/adminController.js";

const router = express.Router();

// All routes require admin authentication
router.use(adminMiddleware);

// User management routes
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserById);
router.patch("/users/:userId/role", updateUserRole);
router.delete("/users/:userId", deleteUserByAdmin);

// Analytics routes
router.get("/analytics", getAnalytics);
router.get("/analytics/realtime", getRealTimeStats);

// Notifications
router.get("/notifications", getNotifications);

// Settings routes
router.get("/settings", getPlatformSettings);

// System health
router.get("/health", getSystemHealth);

export default router;
