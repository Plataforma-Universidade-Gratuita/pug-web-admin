import { API_BASE_URL, JSON_HEADERS } from "@/constants/api";
import {
	RefreshRequestSchema,
	TokenResponseSchema,
	createApiSuccessEnvelopeSchema,
} from "@/schemas/api";
import type { TokenResponse } from "@/types/api";
import { validateAdminToken } from "@/utils/auth";

const RefreshEnvelopeSchema =
	createApiSuccessEnvelopeSchema(TokenResponseSchema);

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
		const envelope = RefreshEnvelopeSchema.parse(json);
		const tokens = envelope.data;

		if (!validateAdminToken(tokens.token).isValid) return null;
		return tokens;
	} catch {
		return null;
	}
}
