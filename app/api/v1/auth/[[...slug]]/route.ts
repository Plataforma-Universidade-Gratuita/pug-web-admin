import { auth } from "@/api";
import {
	LoginRequestSchema,
	LogoutRequestSchema,
	RefreshRequestSchema,
	TokenResponseSchema,
} from "@/schemas/api";
import type { AppRouteSlugContext } from "@/types/client";
import { validateAdminToken } from "@/utils/auth";
import { applySessionCookies, clearSessionCookies } from "@/utils/cookies";
import {
	parseRouteBody,
	routeData,
	routeError,
	routeNoContent,
	routeVoidWithAuthRetry,
} from "@/utils/route";

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
		const body = await parseRouteBody(request, LogoutRequestSchema);
		try {
			await auth.logout(body);
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
	return routeError(new Error("Not found"));
}
