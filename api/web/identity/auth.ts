import { TokenResponseSchema } from "@/schemas/api";
import { webFetch, webVoid } from "@/utils/web-api";

import type { LoginRequest, LogoutRequest, RefreshRequest, TokenResponse } from "@/types/api";

const BASE = "/api/auth";

export async function login(body: LoginRequest): Promise<TokenResponse> {
	return webFetch(`${BASE}/login`, TokenResponseSchema, {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function refresh(body: RefreshRequest): Promise<TokenResponse> {
	return webFetch(`${BASE}/refresh`, TokenResponseSchema, {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function logout(body: LogoutRequest): Promise<void> {
	return webVoid(`${BASE}/logout`, {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function logoutAll(): Promise<void> {
	return webVoid(`${BASE}/logout-all`, { method: "POST" });
}
