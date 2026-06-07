import { env } from "../config/env";
import { AppError } from "../middlewares/error.middleware";
import { User } from "../models";
import { signJwt, verifyJwt } from "../utils/jwt.util";
import { hashSecret, verifySecret } from "../utils/password.util";

type AuthUserResponse = {
  id: string;
  loginId: string | null;
  email: string | null;
  name: string;
  nativeLanguage: string | null;
  koreanLevel: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type AuthTokenResponse = {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: number;
  user: AuthUserResponse;
};

type RegisterInput = {
  loginId?: string;
  password?: string;
  quizQuestion?: string;
  quizAnswer?: string;
};

type LoginInput = {
  loginId?: string;
  password?: string;
};

type VerifyQuizAnswerInput = {
  loginId?: string;
  quizAnswer?: string;
};

type UpdatePasswordInput = {
  resetToken?: string;
  newPassword?: string;
};

const normalizeLoginId = (loginId?: string): string => {
  const normalized = loginId?.trim();
  if (!normalized) {
    throw new AppError("loginId is required", 400);
  }

  if (normalized.length < 3 || normalized.length > 50) {
    throw new AppError("loginId must be between 3 and 50 characters", 400);
  }

  return normalized;
};

const normalizePassword = (password?: string, fieldName = "password"): string => {
  const normalized = password?.trim();
  if (!normalized) {
    throw new AppError(`${fieldName} is required`, 400);
  }

  if (normalized.length < 6 || normalized.length > 100) {
    throw new AppError(`${fieldName} must be between 6 and 100 characters`, 400);
  }

  return normalized;
};

const normalizeRequiredText = (value: string | undefined, fieldName: string): string => {
  const normalized = value?.trim();
  if (!normalized) {
    throw new AppError(`${fieldName} is required`, 400);
  }

  return normalized;
};

const normalizeQuizAnswer = (answer: string): string => {
  return answer.trim().replace(/\s+/g, " ").toLowerCase();
};

const toAuthUserResponse = (user: User): AuthUserResponse => ({
  id: user.id,
  loginId: user.loginId ?? null,
  email: user.email ?? null,
  name: user.name,
  nativeLanguage: user.nativeLanguage ?? null,
  koreanLevel: user.koreanLevel ?? null,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const createTokenResponse = (user: User): AuthTokenResponse => ({
  accessToken: signJwt({
    sub: user.id,
    loginId: user.loginId ?? null,
    email: user.email ?? null,
    purpose: "access"
  }),
  tokenType: "Bearer",
  expiresIn: env.JWT_EXPIRES_IN_SECONDS,
  user: toAuthUserResponse(user)
});

export const registerUser = async (input: RegisterInput): Promise<AuthTokenResponse> => {
  const loginId = normalizeLoginId(input.loginId);
  const password = normalizePassword(input.password);
  const quizQuestion = normalizeRequiredText(input.quizQuestion, "quizQuestion");
  const quizAnswer = normalizeRequiredText(input.quizAnswer, "quizAnswer");

  const existingUser = await User.findOne({ where: { loginId } });
  if (existingUser) {
    throw new AppError("loginId already exists", 409);
  }

  const user = await User.create({
    loginId,
    email: null,
    name: loginId,
    provider: "local",
    passwordHash: await hashSecret(password),
    quizQuestion,
    quizAnswerHash: await hashSecret(normalizeQuizAnswer(quizAnswer)),
    nativeLanguage: null,
    koreanLevel: "intermediate"
  });

  return createTokenResponse(user);
};

export const loginUser = async (input: LoginInput): Promise<AuthTokenResponse> => {
  const loginId = normalizeLoginId(input.loginId);
  const password = normalizePassword(input.password);
  const user = await User.findOne({ where: { loginId } });

  if (!user || !(await verifySecret(password, user.passwordHash))) {
    throw new AppError("Invalid loginId or password", 401);
  }

  return createTokenResponse(user);
};

export const getAuthUser = (user: Express.AuthUser): AuthUserResponse => ({
  id: user.id,
  loginId: user.loginId ?? null,
  email: user.email ?? null,
  name: user.name,
  nativeLanguage: user.nativeLanguage ?? null,
  koreanLevel: user.koreanLevel ?? null,
  createdAt: user.createdAt ?? new Date(),
  updatedAt: user.updatedAt ?? new Date()
});

export const getPasswordQuizQuestion = async (loginIdInput?: string): Promise<{ loginId: string; quizQuestion: string }> => {
  const loginId = normalizeLoginId(loginIdInput);
  const user = await User.findOne({ where: { loginId } });

  if (!user || !user.quizQuestion) {
    throw new AppError("User not found", 404);
  }

  return {
    loginId,
    quizQuestion: user.quizQuestion
  };
};

export const verifyPasswordQuizAnswer = async (
  input: VerifyQuizAnswerInput
): Promise<{ verified: true; resetToken: string; expiresIn: number }> => {
  const loginId = normalizeLoginId(input.loginId);
  const quizAnswer = normalizeRequiredText(input.quizAnswer, "quizAnswer");
  const user = await User.findOne({ where: { loginId } });

  if (!user || !(await verifySecret(normalizeQuizAnswer(quizAnswer), user.quizAnswerHash))) {
    throw new AppError("Invalid loginId or quizAnswer", 401);
  }

  return {
    verified: true,
    resetToken: signJwt(
      {
        sub: user.id,
        loginId: user.loginId ?? null,
        purpose: "password_reset"
      },
      env.PASSWORD_RESET_EXPIRES_IN_SECONDS
    ),
    expiresIn: env.PASSWORD_RESET_EXPIRES_IN_SECONDS
  };
};

export const updatePasswordWithResetToken = async (
  input: UpdatePasswordInput
): Promise<{ success: true; message: string }> => {
  const resetToken = normalizeRequiredText(input.resetToken, "resetToken");
  const newPassword = normalizePassword(input.newPassword, "newPassword");

  let userId: string;
  try {
    const payload = verifyJwt(resetToken);
    if (payload.purpose !== "password_reset") {
      throw new Error("Invalid token purpose");
    }

    userId = payload.sub;
  } catch {
    throw new AppError("Invalid or expired password reset token", 401);
  }

  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  await user.update({
    passwordHash: await hashSecret(newPassword)
  });

  return {
    success: true,
    message: "Password has been reset successfully"
  };
};
