import { webFetch, webVoid } from "@/api/web/utils";
import { WEB_API_ROUTE_BASES } from "@/constants";
import { TokenResponseSchema } from "@/schemas";
import type {
	CredentialsRequest,
	LoginRequest,
	LogoutRequest,
	RefreshRequest,
	TokenResponse,
} from "@/types";

export async function login(body: LoginRequest): Promise<TokenResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.identity.auth}/login`,
		TokenResponseSchema,
		{
			method: "POST",
			body: JSON.stringify(body),
		},
	);
}

export async function refresh(body: RefreshRequest): Promise<TokenResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.identity.auth}/refresh`,
		TokenResponseSchema,
		{
			method: "POST",
			body: JSON.stringify(body),
		},
	);
}

export async function logout(body?: LogoutRequest): Promise<void> {
	return webVoid(
		`${WEB_API_ROUTE_BASES.identity.auth}/logout`,
		body
			? {
					method: "POST",
					body: JSON.stringify(body),
				}
			: { method: "POST" },
	);
}

export async function logoutAll(): Promise<void> {
	return webVoid(`${WEB_API_ROUTE_BASES.identity.auth}/logout-all`, {
		method: "POST",
	});
}

export async function wireCredentials(body: CredentialsRequest): Promise<void> {
	return webVoid(`${WEB_API_ROUTE_BASES.identity.auth}/wire-credentials`, {
		method: "POST",
		body: JSON.stringify(body),
	});
}
