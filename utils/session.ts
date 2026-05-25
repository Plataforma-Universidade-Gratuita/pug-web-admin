import { API_BASE_URL, JSON_HEADERS } from "@/constants";
import { RefreshRequestSchema } from "@/schemas";
import { RefreshSessionEnvelopeSchema } from "@/schemas";
import type { TokenResponse } from "@/types";
import { validateAdminToken } from "@/utils";

export async function refreshAdminSession(
	refreshToken: string,
): Promise<TokenResponse | null> {
	try {
		const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
			method: "POST",
			headers: JSON_HEADERS,
			body: JSON.stringify(RefreshRequestSchema.parse({ refreshToken })),
		});
		if (!response.ok) return null;

		const json = await response.json();
		const envelope = RefreshSessionEnvelopeSchema.parse(json);
		const tokens = envelope.data;

		if (!validateAdminToken(tokens.token).isValid) return null;
		return tokens;
	} catch {
		return null;
	}
}
