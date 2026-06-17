import { NextResponse } from "next/server";

import { z } from "zod";

import { ApiError } from "@/api/utils";
import {
	applySessionCookies,
	clearSessionCookies,
	getServerCookie,
	refreshAdminSession,
} from "@/auth";
import { REFRESH_TOKEN_COOKIE } from "@/constants";

export function routeData<T>(data: T, init?: ResponseInit): NextResponse<T> {
	return NextResponse.json(data, init);
}

export function routeNoContent(init?: ResponseInit): NextResponse {
	return new NextResponse(null, { status: 204, ...init });
}

async function refreshSession() {
	const refreshToken = await getServerCookie(REFRESH_TOKEN_COOKIE);
	if (!refreshToken) {
		return { status: "unauthorized" } as const;
	}

	return refreshAdminSession(refreshToken);
}

function routeSessionRefreshUnavailable(): NextResponse {
	return NextResponse.json(
		{
			code: "SESSION_REFRESH_UNAVAILABLE",
			message: "Session refresh is temporarily unavailable.",
		},
		{ status: 503 },
	);
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

		const refreshResult = await refreshSession();
		if (refreshResult.status === "unauthorized") {
			return routeError(error, { clearSession: true });
		}
		if (refreshResult.status === "unavailable") {
			return routeSessionRefreshUnavailable();
		}

		try {
			const retriedData = await handler(refreshResult.tokens.token);
			const response = routeData(schema.parse(retriedData));
			return applySessionCookies(response, refreshResult.tokens);
		} catch (retryError) {
			if (retryError instanceof ApiError && retryError.status === 401) {
				return routeError(retryError, { clearSession: true });
			}

			return routeError(retryError);
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

		const refreshResult = await refreshSession();
		if (refreshResult.status === "unauthorized") {
			return routeError(error, { clearSession: true });
		}
		if (refreshResult.status === "unavailable") {
			return routeSessionRefreshUnavailable();
		}

		try {
			await handler(refreshResult.tokens.token);
			const response = routeNoContent();
			return applySessionCookies(response, refreshResult.tokens);
		} catch (retryError) {
			if (retryError instanceof ApiError && retryError.status === 401) {
				return routeError(retryError, { clearSession: true });
			}

			return routeError(retryError);
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
