import { NextRequest, NextResponse } from "next/server";
import { createAccessToken, getSessionCookieName, validateAccessCode } from "@/lib/access";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const role = formData.get("role");
  const code = formData.get("code");
  const next = formData.get("next");

  if ((role !== "store" && role !== "ops") || typeof code !== "string") {
    return NextResponse.json(
      {
        error: "invalid_login_request"
      },
      { status: 400 }
    );
  }

  if (!validateAccessCode(role, code)) {
    return NextResponse.redirect(new URL("/access?error=invalid_code", request.url), {
      status: 303
    });
  }

  const token = await createAccessToken(role);
  const redirectTo =
    typeof next === "string" && next.startsWith("/") ? next : role === "ops" ? "/ops/review-queue" : "/store-board";
  const response = NextResponse.redirect(new URL(redirectTo, request.url), {
    status: 303
  });

  response.cookies.set(getSessionCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });

  return response;
}
