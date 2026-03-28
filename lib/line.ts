import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyLineSignature(rawBody: string, signature: string | null) {
  const channelSecret = process.env.LINE_CHANNEL_SECRET;

  if (!channelSecret) {
    return {
      ok: true,
      mode: "skipped" as const
    };
  }

  if (!signature) {
    return {
      ok: false,
      mode: "verified" as const,
      reason: "missing_signature"
    };
  }

  const expected = createHmac("sha256", channelSecret).update(rawBody).digest("base64");
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (actualBuffer.length !== expectedBuffer.length) {
    return {
      ok: false,
      mode: "verified" as const,
      reason: "signature_length_mismatch"
    };
  }

  return {
    ok: timingSafeEqual(actualBuffer, expectedBuffer),
    mode: "verified" as const,
    reason: "signature_mismatch"
  };
}

export function getLineSetupStatus() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const channelSecret = process.env.LINE_CHANNEL_SECRET ?? "";
  const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN ?? "";
  const loginChannelId = process.env.LINE_LOGIN_CHANNEL_ID ?? "";

  return {
    baseUrl,
    webhookUrl: baseUrl ? `${baseUrl.replace(/\/$/, "")}/api/integrations/line/status-callback` : "",
    hasBaseUrl: Boolean(baseUrl),
    hasChannelSecret: Boolean(channelSecret && channelSecret !== "set-this-for-signature-verification"),
    hasChannelAccessToken: Boolean(channelAccessToken && channelAccessToken !== "set-this-for-messaging-api"),
    hasLoginChannelId: Boolean(loginChannelId && loginChannelId !== "set-this-for-line-login"),
    signatureVerificationEnabled: Boolean(channelSecret && channelSecret !== "set-this-for-signature-verification")
  };
}

export function getLineSetupChecklist() {
  return [
    "LINE Developers の Messaging API チャネルを作成する",
    "Webhook URL に /api/integrations/line/status-callback を設定する",
    "Webhook の利用を ON にする",
    "LINE_CHANNEL_SECRET を .env.local に入れる",
    "必要なら LINE_CHANNEL_ACCESS_TOKEN を保存して運用メモに残す",
    "Verify ボタンまたは Test webhook で 200 応答を確認する"
  ];
}
