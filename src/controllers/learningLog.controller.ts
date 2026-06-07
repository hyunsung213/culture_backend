import { NextFunction, Request, Response } from "express";
import { AppError } from "../middlewares/error.middleware";
import {
  createLearningCompleteLog,
  createLearningStartLog,
  getMyLearningLogs
} from "../services/learningLog.service";

export const createLearningStartController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id ?? null;
    if (!userId) {
      throw new AppError("User context is missing", 401);
    }

    const { wordId } = req.body as { wordId?: string };
    if (!wordId) {
      throw new AppError("wordId is required", 400);
    }

    const result = await createLearningStartLog(wordId, userId);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const createLearningCompleteController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id ?? null;
    if (!userId) {
      throw new AppError("User context is missing", 401);
    }

    const { wordId } = req.body as { wordId?: string };
    if (!wordId) {
      throw new AppError("wordId is required", 400);
    }

    const result = await createLearningCompleteLog(wordId, userId);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getMyLearningLogsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id ?? null;
    if (!userId) {
      throw new AppError("User context is missing", 401);
    }

    const result = await getMyLearningLogs(userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
