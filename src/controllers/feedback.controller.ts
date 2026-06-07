import { NextFunction, Request, Response } from "express";
import { AppError } from "../middlewares/error.middleware";
import { createFeedbackForSentence } from "../services/feedback.service";

export const createFeedbackController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { wordId, sentence } = req.body as {
      wordId?: string;
      sentence?: string;
    };

    if (!wordId) {
      throw new AppError("wordId is required", 400);
    }

    if (!sentence) {
      throw new AppError("sentence is required", 400);
    }

    const result = await createFeedbackForSentence({
      userId: req.user?.id ?? null,
      wordId,
      sentence,
      userLevel: req.user?.koreanLevel ?? "intermediate"
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
