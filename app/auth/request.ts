import type { NextRequest } from "next/server";
import { AUTH_COOKIE, AuthService } from "./service";

export function requestIdentity(request: Request) {
  return {
    ip:
      request.headers.get("cf-connecting-ip") ??
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      null,
    userAgent: request.headers.get("user-agent"),
  };
}
export async function requireAuth(request: NextRequest) {
  return new AuthService().authenticate(
    request.cookies.get(AUTH_COOKIE)?.value,
  );
}
