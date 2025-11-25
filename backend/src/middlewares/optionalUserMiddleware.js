import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
import redisClient from "../config/redisDB.js";

// Optional user middleware - doesn't require authentication but attaches user if available
const optionalUserMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      req.user = null;
      return next();
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { _id } = payload;
    if (!_id) {
      req.user = null;
      return next();
    }

    const user = await User.findById(_id);
    if (!user) {
      req.user = null;
      return next();
    }

    // Check if user is blocked in Redis
    const isBlocked = await redisClient.exists(`token:${token}`);
    if (isBlocked) {
      req.user = null;
      return next();
    }

    req.user = user;
    next();
  } catch (error) {
    // Don't fail on error, just set user to null
    req.user = null;
    next();
  }
};

export default optionalUserMiddleware;
