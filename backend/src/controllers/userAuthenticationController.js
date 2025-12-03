import {
  registerUser,
  loginUser,
  checkAuthentication,
} from "../services/auth/authService.js";
import {
  sendSignupVerificationCode,
  verifyCodeAndRegister,
  resendVerificationCodeService,
} from "../services/auth/verificationService.js";
import {
  requestPasswordResetService,
  resetPasswordService,
} from "../services/auth/passwordResetService.js";
import {
  getAllProfiles,
  setUserAsAdmin,
  deleteUserById,
} from "../services/auth/adminService.js";
import { sendWelcomeEmail } from "../utils/emailService.js";

const register = async (req, res) => {
  try {
    const { user, token } = await registerUser(req.body);

    res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });

    // Send welcome email (background)
    sendWelcomeEmail(user.emailId, user.firstName, user.username).catch((err) =>
      console.error("Welcome email failed:", err)
    );

    res.status(200).json({ user, message: "Registration successful" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message || "Registration failed" });
  }
};

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const { user, token } = await loginUser(identifier, password);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({ user, message: "Login successful" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed" });
  }
};

const checkAuthenticatedUser = async (req, res) => {
  try {
    const result = await checkAuthentication(req.user);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const sendSignupVerification = async (req, res) => {
  try {
    const result = await sendSignupVerificationCode(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error("Send verification error:", error);
    res.status(500).json({
      message:
        error.message || "Failed to send verification code. Please try again.",
    });
  }
};

const verifyAndRegister = async (req, res) => {
  try {
    const { email, code } = req.body;
    const result = await verifyCodeAndRegister(email, code);

    res.cookie("token", result.token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      user: result.user,
      message: result.message,
    });
  } catch (error) {
    console.error("Verify and register error:", error);
    if (error.message.includes("already exists")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({
      message: error.message || "Registration failed. Please try again.",
    });
  }
};

const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await resendVerificationCodeService(email);
    res.status(200).json(result);
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({
      message: error.message || "Failed to resend code. Please try again.",
    });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await requestPasswordResetService(email);
    res.status(200).json(result);
  } catch (error) {
    console.error("Password reset request error:", error);
    res.status(500).json({
      message: error.message || "An error occurred. Please try again later.",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const result = await resetPasswordService(token, password);
    res.status(200).json(result);
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(400).json({
      message: error.message || "An error occurred. Please try again later.",
    });
  }
};

const getProfiles = async (req, res) => {
  try {
    const users = await getAllProfiles();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to get profiles" });
  }
};

const setAdmin = async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await setUserAsAdmin(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to set admin" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await deleteUserById(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message || "Failed to delete user" });
  }
};

export {
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
};
