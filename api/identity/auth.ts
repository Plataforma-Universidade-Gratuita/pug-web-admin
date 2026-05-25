import { API_ROUTE_BASES } from "@/constants/api";
import { TokenResponseSchema } from "@/schemas/api/identity/auth";
import type {
	LoginRequest,
	LogoutRequest,
	RefreshRequest,
	TokenResponse,
} from "@/types/api";
import { zfetch, zvoid } from "@/utils/api";


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
	return zvoid(`${API_ROUTE_BASES.identity.auth}/logout-all`, { method: "POST" }, token);
}
