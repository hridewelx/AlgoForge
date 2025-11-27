import express from "express";
import multer from "multer";
import { 
  getUserProfile, 
  updateUserProfile, 
  changePassword, 
  deleteAccount, 
  uploadAvatar, 
  removeAvatar,
  addSecondaryEmail,
  removeSecondaryEmail,
  changePrimaryEmail
} from "../controllers/userProfileController.js";
import userMiddleware from "../middlewares/userMiddleware.js";

const userProfileRoutes = express.Router();

// Configure multer for memory storage (for cloudinary upload)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

userProfileRoutes.get("/getprofile", userMiddleware, getUserProfile);
userProfileRoutes.put("/updateprofile", userMiddleware, updateUserProfile);
userProfileRoutes.put("/changepassword", userMiddleware, changePassword);
userProfileRoutes.delete("/deleteaccount", userMiddleware, deleteAccount);
userProfileRoutes.post("/uploadavatar", userMiddleware, upload.single("avatar"), uploadAvatar);
userProfileRoutes.delete("/removeavatar", userMiddleware, removeAvatar);

// Email management routes
userProfileRoutes.post("/email/add", userMiddleware, addSecondaryEmail);
userProfileRoutes.delete("/email/remove", userMiddleware, removeSecondaryEmail);
userProfileRoutes.put("/email/changeprimary", userMiddleware, changePrimaryEmail);

export default userProfileRoutes;
