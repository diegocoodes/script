import { createCipheriv, randomBytes } from "node:crypto";

function getEncryptionKey() {
  const rawKey = process.env.DATA_ENCRYPTION_KEY;

  if (!rawKey || !/^[a-fA-F0-9]{64}$/.test(rawKey)) {
    throw new Error(
      "DATA_ENCRYPTION_KEY deve conter exatamente 64 caracteres hexadecimais.",
    );
  }

  return Buffer.from(rawKey, "hex");
}

export function encryptSecret(value: string | null | undefined) {
  if (!value) return null;

  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return [iv, tag, encrypted].map((part) => part.toString("base64")).join(".");
}
