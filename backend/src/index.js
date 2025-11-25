import express from "express";
import 'dotenv/config';
import connectMongoDB from "./config/mongoDB.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import authenticationRouter from "./routes/userAuthenticationRoutes.js";
import redisClient from "./config/redisDB.js";
import problemRoutes from "./routes/problemsRoutes.js";
import problemSubmissionRoutes from "./routes/problemSubmissionRoutes.js";
import chatWithAiRoutes from "./routes/chatWithAiRoutes.js";
import problemEditorialRoutes from "./routes/problemEditorialRoutes.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use("/user", authenticationRouter);
app.use("/problems", problemRoutes);
app.use("/editorial", problemEditorialRoutes); 
app.use("/submissions", problemSubmissionRoutes);
app.use("/algoforgeai", chatWithAiRoutes);

async function connectDatabase() {
    try {
        await Promise.all([
            connectMongoDB(),
            redisClient.connect()
        ]);
        console.log("Database connected");

        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}

connectDatabase();