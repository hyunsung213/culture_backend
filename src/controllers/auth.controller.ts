import { NextFunction, Request, Response } from "express";
import {
  getAuthUser,
  getPasswordQuizQuestion,
  loginUser,
  registerUser,
  verifyPasswordQuizAnswer,
  updatePasswordWithResetToken
} from "../services/auth.service";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const meController = (req: Request, res: Response): void => {
  res.json({
    user: getAuthUser(req.user as Express.AuthUser)
  });
};

export const passwordQuestionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await getPasswordQuizQuestion(req.body?.loginId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const passwordResetController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await updatePasswordWithResetToken(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const passwordVerifyController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await verifyPasswordQuizAnswer(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
