import dotenv from "dotenv";

dotenv.config();

const requiredEnv = [
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "DB_DIALECT"
] as const;

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const getJwtSecret = (): string => {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Missing required environment variable: JWT_SECRET");
  }

  return "development-jwt-secret-change-me";
};

const parseCsvEnv = (value: string | undefined, fallback: string[]): string[] => {
  const rawValue = value?.trim();
  if (!rawValue) {
    return fallback;
  }

  return rawValue
    .split(",")
    .map((item) => item.trim().replace(/\/+$/, ""))
    .filter(Boolean);
};

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 4000),
  DB_HOST: process.env.DB_HOST as string,
  DB_PORT: Number(process.env.DB_PORT),
  DB_NAME: process.env.DB_NAME as string,
  DB_USER: process.env.DB_USER as string,
  DB_PASSWORD: process.env.DB_PASSWORD as string,
  DB_DIALECT: (process.env.DB_DIALECT ?? "postgres") as "postgres",
  LLM_SERVER_URL: process.env.LLM_SERVER_URL ?? "http://localhost:8080",
  FRONTEND_ORIGINS: parseCsvEnv(process.env.FRONTEND_ORIGINS, [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
  ]),
  JWT_SECRET: getJwtSecret(),
  JWT_EXPIRES_IN_SECONDS: Number(process.env.JWT_EXPIRES_IN_SECONDS ?? 60 * 60 * 24 * 7),
  PASSWORD_RESET_EXPIRES_IN_SECONDS: Number(process.env.PASSWORD_RESET_EXPIRES_IN_SECONDS ?? 60 * 10)
};
