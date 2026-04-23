import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/constants/auth";
import type { TokenResponse } from "@/types/api";

export function getAccessTokenFromRequest(request: {
	cookies: { get(name: string): { value: string } | undefined };
}): string | undefined {
	return request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
}

export function getRefreshTokenFromRequest(request: {
	cookies: { get(name: string): { value: string } | undefined };
}): string | undefined {
	return request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
}

export async function getServerCookie(
	name: string,
): Promise<string | undefined> {
	return (await cookies()).get(name)?.value;
}

function sessionCookieOptions(maxAge: number) {
	return {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax" as const,
		path: "/",
		maxAge,
	};
}

export function applySessionCookies(
	response: NextResponse,
	tokens: TokenResponse,
): NextResponse {
	response.cookies.set(
		ACCESS_TOKEN_COOKIE,
		tokens.token,
		sessionCookieOptions(tokens.expiresIn),
	);
	response.cookies.set(
		REFRESH_TOKEN_COOKIE,
		tokens.refreshToken,
		sessionCookieOptions(tokens.refreshExpiresIn),
	);
	return response;
}

export function clearSessionCookies(response: NextResponse): NextResponse {
	response.cookies.delete(ACCESS_TOKEN_COOKIE);
	response.cookies.delete(REFRESH_TOKEN_COOKIE);
	return response;
}
