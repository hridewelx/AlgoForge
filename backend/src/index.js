import express from "express";
import "dotenv/config";
import connectMongoDB from "./config/mongoDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authenticationRouter from "./routes/userAuthenticationRoutes.js";
import redisClient from "./config/redisDB.js";
import problemRoutes from "./routes/problemsRoutes.js";
import problemSubmissionRoutes from "./routes/problemSubmissionRoutes.js";
import chatWithAiRoutes from "./routes/chatWithAiRoutes.js";
import problemEditorialRoutes from "./routes/problemEditorialRoutes.js";
import userProfileRoutes from "./routes/userProfileRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import oauthRouter from "./routes/oauthRoutes.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);
app.use("/user", authenticationRouter);
app.use("/auth", oauthRouter);
app.use("/profile", userProfileRoutes);
app.use("/problems", problemRoutes);
app.use("/editorial", problemEditorialRoutes);
app.use("/submissions", problemSubmissionRoutes);
app.use("/algoforgeai", chatWithAiRoutes);
app.use("/admin", adminRoutes);

async function connectDatabase() {
  try {
    await Promise.all([connectMongoDB(), redisClient.connect()]);
    console.log("Database connected");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

connectDatabase();
