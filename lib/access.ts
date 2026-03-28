const encoder = new TextEncoder();

export type AccessRole = "store" | "ops";

const sessionCookieName = "locagox_access";
const sessionDurationMs = 1000 * 60 * 60 * 12;

function getSecret() {
  return process.env.ACCESS_SESSION_SECRET ?? "dev-only-change-me";
}

async function importKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    {
      name: "HMAC",
      hash: "SHA-256"
    },
    false,
    ["sign", "verify"]
  );
}

function toBase64Url(input: ArrayBuffer | string) {
  let base64: string;

  if (typeof Buffer !== "undefined") {
    const buffer =
      typeof input === "string" ? Buffer.from(input, "utf8") : Buffer.from(new Uint8Array(input));
    base64 = buffer.toString("base64");
  } else {
    const binary =
      typeof input === "string"
        ? input
        : String.fromCharCode(...new Uint8Array(input));
    base64 = btoa(binary);
  }

  return base64.replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function fromBase64Url(input: string) {
  const normalized = input.replaceAll("-", "+").replaceAll("_", "/");
  const padding = "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
  const withPadding = `${normalized}${padding}`;

  if (typeof Buffer !== "undefined") {
    return Uint8Array.from(Buffer.from(withPadding, "base64"));
  }

  const binary = atob(withPadding);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export async function createAccessToken(role: AccessRole) {
  const payload = JSON.stringify({
    role,
    exp: Date.now() + sessionDurationMs
  });
  const key = await importKey();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));

  return `${toBase64Url(payload)}.${toBase64Url(signature)}`;
}

export async function verifyAccessToken(token: string | undefined | null) {
  if (!token) {
    return null;
  }

  const [payloadPart, signaturePart] = token.split(".");

  if (!payloadPart || !signaturePart) {
    return null;
  }

  try {
    const payloadBuffer = fromBase64Url(payloadPart);
    const signatureBuffer = fromBase64Url(signaturePart);
    const key = await importKey();
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBuffer,
      payloadBuffer
    );

    if (!isValid) {
      return null;
    }

    const payloadText = new TextDecoder().decode(payloadBuffer);
    const payload = JSON.parse(payloadText) as {
      role: AccessRole;
      exp: number;
    };

    if (payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function getSessionCookieName() {
  return sessionCookieName;
}

export function validateAccessCode(role: AccessRole, code: string) {
  const configured =
    role === "ops" ? process.env.OPS_ACCESS_CODE : process.env.STORE_BOARD_ACCESS_CODE;

  return Boolean(configured) && configured === code;
}

export function roleCanAccess(role: AccessRole, pathname: string) {
  if (role === "ops") {
    return pathname.startsWith("/ops") || pathname.startsWith("/store-board") || pathname.startsWith("/api/ops") || pathname.startsWith("/api/store-board");
  }

  return pathname.startsWith("/store-board") || pathname.startsWith("/api/store-board");
}
