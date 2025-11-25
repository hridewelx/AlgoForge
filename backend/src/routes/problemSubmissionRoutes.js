import express from "express";
import { submitProblem, runProblem, voteSubmission, getSolutions } from "../controllers/problemSubmissionController.js";
import userMiddleware from "../middlewares/userMiddleware.js";
import optionalUserMiddleware from "../middlewares/optionalUserMiddleware.js";
import submitCodeRateLimiter from "../middlewares/submitCodeRatelimiter.js";

const problemSubmissionRoutes = express.Router();

problemSubmissionRoutes.post("/run/:problemId", userMiddleware, runProblem);
problemSubmissionRoutes.post("/submit/:problemId", userMiddleware, submitCodeRateLimiter, submitProblem);
problemSubmissionRoutes.post("/vote/:submissionId", userMiddleware, voteSubmission);
problemSubmissionRoutes.get("/solutions/:problemId", optionalUserMiddleware, getSolutions);

export default problemSubmissionRoutes;