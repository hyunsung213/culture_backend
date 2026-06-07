import { NextFunction, Request, Response } from "express";

export const MOCK_USER_ID = "00000000-0000-0000-0000-000000000001";

export const mockAuth = (req: Request, _res: Response, next: NextFunction): void => {
  req.user = {
    id: MOCK_USER_ID,
    email: "demo@ieung.app",
    loginId: "demo",
    name: "Demo User",
    koreanLevel: "intermediate",
    nativeLanguage: "en",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  next();
};
