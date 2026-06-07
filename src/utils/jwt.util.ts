import { createHmac, timingSafeEqual } from "crypto";
import { env } from "../config/env";

export type JwtPayload = {
  sub: string;
  loginId?: string | null;
  email?: string | null;
  purpose?: "access" | "password_reset";
  iat?: number;
  exp?: number;
};

const base64UrlEncode = (value: object | string): string => {
  const input = typeof value === "string" ? value : JSON.stringify(value);
  return Buffer.from(input).toString("base64url");
};

const sign = (input: string): string => {
  return createHmac("sha256", env.JWT_SECRET).update(input).digest("base64url");
};

export const signJwt = (
  payload: JwtPayload,
  expiresInSeconds = env.JWT_EXPIRES_IN_SECONDS
): string => {
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: "HS256",
    typ: "JWT"
  };
  const body = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds
  };
  const encodedHeader = base64UrlEncode(header);
  const encodedBody = base64UrlEncode(body);
  const unsignedToken = `${encodedHeader}.${encodedBody}`;

  return `${unsignedToken}.${sign(unsignedToken)}`;
};

export const verifyJwt = (token: string): JwtPayload => {
  const [encodedHeader, encodedBody, signature] = token.split(".");
  if (!encodedHeader || !encodedBody || !signature) {
    throw new Error("Invalid token");
  }

  const unsignedToken = `${encodedHeader}.${encodedBody}`;
  const expectedSignature = sign(unsignedToken);
  const signatureBuffer = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedSignatureBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
  ) {
    throw new Error("Invalid token signature");
  }

  const payload = JSON.parse(Buffer.from(encodedBody, "base64url").toString("utf8")) as JwtPayload;
  const now = Math.floor(Date.now() / 1000);

  if (!payload.sub) {
    throw new Error("Invalid token subject");
  }

  if (payload.exp && payload.exp < now) {
    throw new Error("Token expired");
  }

  return payload;
};
