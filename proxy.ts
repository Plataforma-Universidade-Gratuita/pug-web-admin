import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
	applySessionCookies,
	clearSessionCookies,
	getAccessTokenFromRequest,
	getRefreshTokenFromRequest,
} from "@/auth/cookies";
import { refreshAdminSession } from "@/auth/session";
import { validateAdminToken } from "@/auth/utils";
import { HOME_ROUTE, LOGIN_ROUTE, PUBLIC_ROUTES } from "@/constants/auth";

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const accessToken = getAccessTokenFromRequest(request);
	const refreshToken = getRefreshTokenFromRequest(request);

	const isPublic = PUBLIC_ROUTES.includes(pathname);
	const isValid = accessToken ? validateAdminToken(accessToken).isValid : false;

	if (pathname === LOGIN_ROUTE) {
		if (isValid) {
			return NextResponse.redirect(new URL(HOME_ROUTE, request.url));
		}

		return NextResponse.next();
	}

	if (isPublic) {
		return NextResponse.next();
	}

	if (isValid) {
		return NextResponse.next();
	}

	if (refreshToken) {
		const tokens = await refreshAdminSession(refreshToken);
		if (tokens) {
			const response = NextResponse.redirect(request.url);
			return applySessionCookies(response, tokens);
		}
	}

	return clearAndRedirect(request);
}

function clearAndRedirect(request: NextRequest): NextResponse {
	const response = NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));
	return clearSessionCookies(response);
}

/* Do not delete it, it's a must-have */
export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
