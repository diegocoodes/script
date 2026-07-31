import { scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
  type SessionPayload,
} from "@/lib/session";

function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, expectedHash] = storedHash.split("$");
  if (algorithm !== "scrypt" || !salt || !expectedHash) return false;

  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function authenticateAdmin(email: string, password: string) {
  const configuredEmail = process.env.SEED_ADMIN_EMAIL?.toLowerCase();
  if (!configuredEmail || email.toLowerCase() !== configuredEmail) return null;

  const user = await prisma.user.findUnique({
    where: { email: configuredEmail },
    select: { email: true, name: true, passwordHash: true, active: true, role: true },
  });
  if (
    !user ||
    !user.active ||
    user.role !== "ADMIN" ||
    !verifyPassword(password, user.passwordHash)
  ) {
    return null;
  }

  return { email: user.email, name: user.name };
}

export async function getCurrentSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}
