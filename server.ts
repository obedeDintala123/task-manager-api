import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { teamRouter } from "./routes/route.team.js";
import { authRouter } from "./routes/route.auth.js";
import { userRouter } from "./routes/route.user.js";
import { analysisRouter } from "./routes/route.analysis.js";
import { taskRouter } from "./routes/route.task.js";
import { swaggerUi, specs } from "./swagger.js";

dotenv.config();

const server = express();
const PORT = process.env.PORT || 3001;

server.use(express.json());
server.use(cookieParser());
server.use(
  cors({
    origin: ["https://tasking-front.vercel.app", "http://localhost:3000"],
    credentials: true,
  })
);

server.get("/", (req, res) => {
  res.send("API is running");
});
server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
server.use("/api/v1", userRouter);
server.use("/api/v1/auth", authRouter);
server.use("/api/v1", teamRouter);
server.use("/api/v1/analysis", analysisRouter);
server.use("/api/v1", taskRouter);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
