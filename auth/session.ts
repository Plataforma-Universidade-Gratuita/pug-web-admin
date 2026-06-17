import { API_ROUTE_BASES } from "@/api/services/constants";
import { API_BASE_URL, JSON_HEADERS } from "@/constants";
import { RefreshRequestSchema } from "@/schemas/api";
import { RefreshSessionEnvelopeSchema } from "@/schemas/client";
import type { TokenResponse } from "@/types/api";

/*
 * This import must remain relative because importing the validation helper through
 * the auth barrel would create an avoidable self-import inside the auth root.
 */
import { validateAdminToken } from "./utils";

export type SessionRefreshResult =
	| { status: "success"; tokens: TokenResponse }
	| { status: "unauthorized" }
	| { status: "unavailable" };

export async function refreshAdminSession(
	refreshToken: string,
): Promise<SessionRefreshResult> {
	try {
		const response = await fetch(
			`${API_BASE_URL}${API_ROUTE_BASES.identity.auth}/refresh`,
			{
				method: "POST",
				headers: JSON_HEADERS,
				body: JSON.stringify(RefreshRequestSchema.parse({ refreshToken })),
				cache: "no-store",
			},
		);
		if (!response.ok) {
			if (response.status === 401 || response.status === 403) {
				return { status: "unauthorized" };
			}

			return { status: "unavailable" };
		}

		const json = await response.json();
		const envelope = RefreshSessionEnvelopeSchema.parse(json);
		const tokens = envelope.data;

		if (!validateAdminToken(tokens.token).isValid) {
			return { status: "unauthorized" };
		}

		return { status: "success", tokens };
	} catch {
		return { status: "unavailable" };
	}
}
