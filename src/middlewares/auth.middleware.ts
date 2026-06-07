import { NextFunction, Request, Response } from "express";
import { AppError } from "./error.middleware";
import { User } from "../models";
import { verifyJwt } from "../utils/jwt.util";

const getBearerToken = (req: Request): string | null => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return null;
  }

  const [scheme, token] = authorization.split(" ");
  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
};

export const authenticateJwt = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = getBearerToken(req);
    if (!token) {
      throw new AppError("Authorization bearer token is required", 401);
    }

    const payload = verifyJwt(token);
    const user = await User.findByPk(payload.sub);

    if (!user) {
      throw new AppError("Authenticated user not found", 401);
    }

    req.user = {
      id: user.id,
      loginId: user.loginId ?? null,
      email: user.email ?? null,
      name: user.name,
      koreanLevel: user.koreanLevel ?? null,
      nativeLanguage: user.nativeLanguage ?? null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    next(new AppError("Invalid or expired token", 401));
  }
};

export const optionalJwt = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const token = getBearerToken(req);
  if (!token) {
    next();
    return;
  }

  await authenticateJwt(req, _res, next);
};
