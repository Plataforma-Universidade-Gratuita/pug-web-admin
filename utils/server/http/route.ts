import { NextResponse } from "next/server";

import { z } from "zod";

import { REFRESH_TOKEN_COOKIE } from "@/constants";
import {
	applySessionCookies,
	clearSessionCookies,
	getServerCookie,
} from "@/utils/server/auth/cookies";
import { refreshAdminSession } from "@/utils/server/auth/session";
import { ApiError } from "@/utils/shared/http/api";

export function routeData<T>(data: T, init?: ResponseInit): NextResponse<T> {
	return NextResponse.json(data, init);
}

export function routeNoContent(init?: ResponseInit): NextResponse {
	return new NextResponse(null, { status: 204, ...init });
}

async function refreshSession() {
	const refreshToken = await getServerCookie(REFRESH_TOKEN_COOKIE);
	if (!refreshToken) return null;
	return refreshAdminSession(refreshToken);
}

export async function routeWithAuthRetry<T>(
	handler: (token?: string) => Promise<T>,
	schema: z.ZodType<T>,
): Promise<NextResponse> {
	try {
		const data = await handler();
		return routeData(schema.parse(data));
	} catch (error) {
		if (!(error instanceof ApiError) || error.status !== 401) {
			return routeError(error);
		}

		const tokens = await refreshSession();
		if (!tokens) return routeError(error, { clearSession: true });

		try {
			const retriedData = await handler(tokens.token);
			const response = routeData(schema.parse(retriedData));
			return applySessionCookies(response, tokens);
		} catch (retryError) {
			return routeError(retryError, { clearSession: true });
		}
	}
}

export async function routeVoidWithAuthRetry(
	handler: (token?: string) => Promise<void>,
): Promise<NextResponse> {
	try {
		await handler();
		return routeNoContent();
	} catch (error) {
		if (!(error instanceof ApiError) || error.status !== 401) {
			return routeError(error);
		}

		const tokens = await refreshSession();
		if (!tokens) return routeError(error, { clearSession: true });

		try {
			await handler(tokens.token);
			const response = routeNoContent();
			return applySessionCookies(response, tokens);
		} catch (retryError) {
			return routeError(retryError, { clearSession: true });
		}
	}
}

export async function parseRouteBody<T>(
	request: Request,
	schema: z.ZodType<T>,
): Promise<T> {
	const json = await request.json();
	return schema.parse(json);
}

export function routeError(
	error: unknown,
	options?: { clearSession?: boolean },
): NextResponse {
	if (error instanceof Error && error.message === "Not found") {
		const response = NextResponse.json(
			{ code: "NOT_FOUND", message: "Route not found." },
			{ status: 404 },
		);
		return options?.clearSession ? clearSessionCookies(response) : response;
	}
	if (error instanceof Error && error.message === "Forbidden") {
		const response = NextResponse.json(
			{ code: "FORBIDDEN", message: "Forbidden." },
			{ status: 403 },
		);
		return options?.clearSession ? clearSessionCookies(response) : response;
	}
	if (error instanceof ApiError) {
		const response = NextResponse.json(
			{
				code: error.code,
				message: error.message,
				details: error.details,
				correlationId: error.correlationId,
			},
			{ status: error.status },
		);
		return options?.clearSession ? clearSessionCookies(response) : response;
	}

	console.error("Unexpected route handler error:", error);

	const response = NextResponse.json(
		{
			code: "INTERNAL_ERROR",
			message: "Unexpected internal error.",
		},
		{ status: 500 },
	);
	return options?.clearSession ? clearSessionCookies(response) : response;
}
