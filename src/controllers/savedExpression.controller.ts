import { NextFunction, Request, Response } from "express";
import { AppError } from "../middlewares/error.middleware";
import {
  createSavedExpression,
  getMySavedExpressions
} from "../services/savedExpression.service";

export const createSavedExpressionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id ?? null;
    if (!userId) {
      throw new AppError("User context is missing", 401);
    }

    const created = await createSavedExpression(req.body, userId);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

export const getMySavedExpressionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id ?? null;
    if (!userId) {
      throw new AppError("User context is missing", 401);
    }

    const result = await getMySavedExpressions(userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
