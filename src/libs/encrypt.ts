import crypto from "crypto";

const IV_LENGTH = 16;

export function encryptData(data: string) {
  if (!process.env.ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY env variable not set");
  }

  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(process.env.ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(data);

  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decryptData(data: string) {
  if (!process.env.ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY env variable not set");
  }

  let parts = data.split(":");
  let ivPart = parts.shift();
  if (!ivPart) {
    throw new Error("IV part of string not found");
  }

  let iv = Buffer.from(ivPart, "hex");
  let encryptedText = Buffer.from(parts.join(":"), "hex");

  let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(process.env.ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
