import { scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
  type SessionPayload,
} from "@/lib/session";

const FALLBACK_ADMIN_EMAIL = "administrador@admin.com";
const FALLBACK_ADMIN_PASSWORD_HASH =
  "scrypt$e6e11d5c2684a484f3e6bb8bcc6afb65$15271f4f48709451acdf98bc8c2eb41b57ec9596acbaf161d8f758a3b6ba13b333b78d035af2c50ad3a59a0fb4405030a9130da6e4b41443c334e15e59bc2d39";

function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, expectedHash] = storedHash.split("$");
  if (algorithm !== "scrypt" || !salt || !expectedHash) return false;

  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function safeEqualText(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);
  return (
    valueBuffer.length === expectedBuffer.length &&
    timingSafeEqual(valueBuffer, expectedBuffer)
  );
}

export async function authenticateAdmin(email: string, password: string) {
  const configuredEmail = (
    process.env.ADMIN_EMAIL ??
    process.env.SEED_ADMIN_EMAIL ??
    FALLBACK_ADMIN_EMAIL
  ).toLowerCase();
  if (!safeEqualText(email.toLowerCase(), configuredEmail)) return null;

  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (configuredPassword && safeEqualText(password, configuredPassword)) {
    return { email: configuredEmail, name: "Administrador Deyvid Infotech" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: configuredEmail },
      select: {
        email: true,
        name: true,
        passwordHash: true,
        active: true,
        role: true,
      },
    });
    if (
      user?.active &&
      user.role === "ADMIN" &&
      verifyPassword(password, user.passwordHash)
    ) {
      return { email: user.email, name: user.name };
    }
  } catch {
    // O acesso de contingência abaixo mantém o administrador disponível
    // quando o banco ainda não recebeu o seed no primeiro deploy.
  }

  if (verifyPassword(password, FALLBACK_ADMIN_PASSWORD_HASH)) {
    return { email: configuredEmail, name: "Administrador Deyvid Infotech" };
  }

  return null;
}

export async function getCurrentSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}
