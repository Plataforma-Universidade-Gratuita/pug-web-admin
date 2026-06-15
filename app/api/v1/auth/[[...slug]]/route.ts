import { auth } from "@/api/services";
import {
	parseRouteBody,
	routeData,
	routeError,
	routeNoContent,
	routeVoidWithAuthRetry,
} from "@/app/api/utils";
import {
	applySessionCookies,
	clearSessionCookies,
	getServerCookie,
	validateAdminToken,
} from "@/auth";
import { REFRESH_TOKEN_COOKIE } from "@/constants/auth";
import {
	CredentialsRequestSchema,
	LoginRequestSchema,
	LogoutRequestSchema,
	RefreshRequestSchema,
	TokenResponseSchema,
} from "@/schemas/api";
import type { AppRouteSlugContext } from "@/types/client";

async function resolveLogoutRefreshToken(
	request: Request,
): Promise<string | undefined> {
	const bodyText = await request.text();
	if (bodyText.trim().length > 0) {
		const body = LogoutRequestSchema.parse(JSON.parse(bodyText));
		return body.refreshToken;
	}

	return getServerCookie(REFRESH_TOKEN_COOKIE);
}

export async function POST(request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;
	if (slug.length === 1 && slug[0] === "login") {
		const body = await parseRouteBody(request, LoginRequestSchema);
		try {
			const data = await auth.login(body);
			if (!validateAdminToken(data.token).isValid) {
				return routeError(new Error("Forbidden"));
			}
			return applySessionCookies(
				routeData(TokenResponseSchema.parse(data)),
				data,
			);
		} catch (error) {
			return routeError(error);
		}
	}
	if (slug.length === 1 && slug[0] === "refresh") {
		try {
			const body = await parseRouteBody(request, RefreshRequestSchema);
			const data = await auth.refresh(body);
			if (!validateAdminToken(data.token).isValid) {
				return routeError(new Error("Forbidden"), { clearSession: true });
			}
			return applySessionCookies(
				routeData(TokenResponseSchema.parse(data)),
				data,
			);
		} catch (error) {
			return routeError(error, { clearSession: true });
		}
	}
	if (slug.length === 1 && slug[0] === "logout") {
		try {
			const refreshToken = await resolveLogoutRefreshToken(request);
			if (!refreshToken) {
				return clearSessionCookies(routeNoContent());
			}

			await auth.logout({ refreshToken });
			return clearSessionCookies(routeNoContent());
		} catch (error) {
			return routeError(error);
		}
	}
	if (slug.length === 1 && slug[0] === "logout-all") {
		const response = await routeVoidWithAuthRetry(token =>
			auth.logoutAll(token),
		);
		return clearSessionCookies(response);
	}
	if (slug.length === 1 && slug[0] === "wire-credentials") {
		try {
			const body = await parseRouteBody(request, CredentialsRequestSchema);
			await auth.wireCredentials(body);
			const refreshToken = await getServerCookie(REFRESH_TOKEN_COOKIE);
			if (!refreshToken) {
				return routeNoContent();
			}

			const tokens = await auth.refresh({ refreshToken });
			if (!validateAdminToken(tokens.token).isValid) {
				return routeError(new Error("Forbidden"), { clearSession: true });
			}

			return applySessionCookies(routeNoContent(), tokens);
		} catch (error) {
			return routeError(error);
		}
	}
	return routeError(new Error("Not found"));
}
