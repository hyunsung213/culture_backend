import cors from "cors";
import axios from "axios";
import express, { NextFunction, Request, Response } from "express";
import { env } from "./config/env";
import { AppError, errorHandler } from "./middlewares/error.middleware";
import { authenticateJwt, optionalJwt } from "./middlewares/auth.middleware";
import authRoutes from "./routes/auth.routes";
import feedbackRoutes from "./routes/feedback.routes";
import learningLogRoutes from "./routes/learningLog.routes";
import savedExpressionRoutes from "./routes/savedExpression.routes";
import wordRoutes from "./routes/word.routes";

const app = express();

const allowedFrontendOrigins = new Set(env.FRONTEND_ORIGINS);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedFrontendOrigins.has(origin.replace(/\/+$/, ""))) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Ieung main backend is running"
  });
});

app.get("/llmHealth", async (_req, res) => {
  const startedAt = Date.now();

  try {
    const response = await axios.get(env.LLM_SERVER_URL, {
      timeout: 3000,
      validateStatus: () => true
    });

    res.json({
      status: "ok",
      connected: true,
      llmServerUrl: env.LLM_SERVER_URL,
      llmStatusCode: response.status,
      responseTimeMs: Date.now() - startedAt
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      connected: false,
      llmServerUrl: env.LLM_SERVER_URL,
      message: "LLM server is not reachable",
      responseTimeMs: Date.now() - startedAt
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/words", optionalJwt, wordRoutes);
app.use("/feedback", optionalJwt, feedbackRoutes);
app.use("/api/feedback", optionalJwt, feedbackRoutes);
app.use("/api/saved-expressions", authenticateJwt, savedExpressionRoutes);
app.use("/api/learning-logs", authenticateJwt, learningLogRoutes);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError("Route not found", 404));
});

app.use(errorHandler);

export default app;
