import "express";

declare global {
  namespace Express {
    interface AuthUser {
      id: string;
      loginId?: string | null;
      email?: string | null;
      name: string;
      koreanLevel?: string | null;
      nativeLanguage?: string | null;
      createdAt?: Date;
      updatedAt?: Date;
    }

    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
