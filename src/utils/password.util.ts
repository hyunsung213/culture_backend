import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scrypt = promisify(scryptCallback);
const HASH_PREFIX = "scrypt";
const KEY_LENGTH = 64;

export const hashSecret = async (secret: string): Promise<string> => {
  const salt = randomBytes(16).toString("hex");
  const key = (await scrypt(secret, salt, KEY_LENGTH)) as Buffer;

  return `${HASH_PREFIX}$${salt}$${key.toString("hex")}`;
};

export const verifySecret = async (secret: string, storedHash: string | null | undefined): Promise<boolean> => {
  if (!storedHash) {
    return false;
  }

  const [prefix, salt, keyHex] = storedHash.split("$");
  if (prefix !== HASH_PREFIX || !salt || !keyHex) {
    return false;
  }

  const expectedKey = Buffer.from(keyHex, "hex");
  const actualKey = (await scrypt(secret, salt, expectedKey.length)) as Buffer;

  if (expectedKey.length !== actualKey.length) {
    return false;
  }

  return timingSafeEqual(expectedKey, actualKey);
};
