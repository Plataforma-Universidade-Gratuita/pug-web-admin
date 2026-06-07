import { zfetch, zvoid } from "@/api/utils";
import { API_ROUTE_BASES } from "@/constants";
import { TokenResponseSchema } from "@/schemas";
import type {
	CredentialsRequest,
	LoginRequest,
	LogoutRequest,
	RefreshRequest,
	TokenResponse,
} from "@/types";

export async function login(body: LoginRequest): Promise<TokenResponse> {
	return zfetch(
		`${API_ROUTE_BASES.identity.auth}/login`,
		{ method: "POST", body: JSON.stringify(body) },
		TokenResponseSchema,
	);
}

export async function refresh(body: RefreshRequest): Promise<TokenResponse> {
	return zfetch(
		`${API_ROUTE_BASES.identity.auth}/refresh`,
		{ method: "POST", body: JSON.stringify(body) },
		TokenResponseSchema,
	);
}

export async function logout(body: LogoutRequest): Promise<void> {
	return zvoid(`${API_ROUTE_BASES.identity.auth}/logout`, {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function logoutAll(token?: string): Promise<void> {
	return zvoid(
		`${API_ROUTE_BASES.identity.auth}/logout-all`,
		{ method: "POST" },
		token,
	);
}

export async function wireCredentials(
	body: CredentialsRequest,
	token?: string,
): Promise<void> {
	return zvoid(
		`${API_ROUTE_BASES.identity.auth}/wire-credentials`,
		{ method: "POST", body: JSON.stringify(body) },
		token,
	);
}
