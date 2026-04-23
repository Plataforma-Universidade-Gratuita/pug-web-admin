import { jwtDecode } from "jwt-decode";

/**
 * Represents the decoded claims inside the JWT access token
 * signed by the PUG backend (SmallRye JWT / MicroProfile).
 */
export interface PugJwtPayload {
	/** Standard MicroProfile "user principal name" — the account email. */
	upn: string;
	/** Standard MicroProfile groups claim — role as a single-element array (e.g. ["ADMIN"]). */
	groups: ("ADMIN" | "PARTNER" | "STUDENT")[];
	/** Custom claim — the account UUID. */
	accountId: string;
	/** Custom claim — the user UUID. */
	userId: string;
	/** Issued-at (epoch seconds). */
	iat: number;
	/** Expiration (epoch seconds). */
	exp: number;
}

/**
 * Validates the JWT structure, expiration, and ADMIN role.
 * Safe to use in both Edge (Middleware) and Browser environments.
 */
export function validateAdminToken(token: string): { isValid: boolean; payload?: PugJwtPayload } {
	try {
		const payload = jwtDecode<PugJwtPayload>(token);

		const isExpired = payload.exp * 1000 < Date.now();
		if (isExpired) return { isValid: false };

		if (!payload.groups?.includes("ADMIN")) return { isValid: false };

		return { isValid: true, payload };
	} catch {
		return { isValid: false };
	}
}