import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
	validateAdminToken,
	refreshAdminSession,
	applySessionCookies,
	clearSessionCookies,
	getAccessTokenFromRequest,
	getRefreshTokenFromRequest,
} from "@/auth";
import { HOME_ROUTE, LOGIN_ROUTE } from "@/constants";

const PUBLIC_ROUTES = [LOGIN_ROUTE];

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

		if (refreshToken) {
			const refreshResult = await refreshAdminSession(refreshToken);
			if (refreshResult.status === "success") {
				const response = NextResponse.redirect(
					new URL(HOME_ROUTE, request.url),
				);
				return applySessionCookies(response, refreshResult.tokens);
			}
			if (refreshResult.status === "unauthorized") {
				return clearSessionCookies(NextResponse.next());
			}
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
		const refreshResult = await refreshAdminSession(refreshToken);
		if (refreshResult.status === "success") {
			const response = NextResponse.redirect(request.url);
			return applySessionCookies(response, refreshResult.tokens);
		}
		if (refreshResult.status === "unauthorized") {
			return clearAndRedirect(request);
		}

		return redirectToLogin(request);
	}

	return clearAndRedirect(request);
}

function redirectToLogin(request: NextRequest): NextResponse {
	return NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));
}

function clearAndRedirect(request: NextRequest): NextResponse {
	const response = redirectToLogin(request);
	return clearSessionCookies(response);
}

/* Do not delete it, it's a must-have */
export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
