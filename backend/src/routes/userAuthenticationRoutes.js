import express from "express";
import {
  register,
  login,
  logout,
  getProfiles,
  setAdmin,
  deleteUser,
  checkAuthenticatedUser,
  requestPasswordReset,
  resetPassword,
  sendSignupVerification,
  verifyAndRegister,
  resendVerificationCode,
} from "../controllers/userAuthenticationController.js";
import userMiddleware from "../middlewares/userMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const authenticationRouter = express.Router();

// Email verification signup flow
authenticationRouter.post("/signup/send-code", sendSignupVerification);
authenticationRouter.post("/signup/verify", verifyAndRegister);
authenticationRouter.post("/signup/resend-code", resendVerificationCode);

// Legacy direct register (kept for OAuth users)
authenticationRouter.post("/register", register);
authenticationRouter.post("/login", login);
authenticationRouter.post("/logout", userMiddleware, logout);
authenticationRouter.get("/getprofiles", userMiddleware, getProfiles);
authenticationRouter.post("/admin/register", adminMiddleware, setAdmin);
authenticationRouter.post("/delete", userMiddleware, deleteUser);
authenticationRouter.get(
  "/checkauthentication",
  userMiddleware,
  checkAuthenticatedUser
);

// Password reset routes
authenticationRouter.post("/forgot-password", requestPasswordReset);
authenticationRouter.post("/reset-password", resetPassword);

export default authenticationRouter;
