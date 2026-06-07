import { jwtDecode } from "jwt-decode";

import type {
	AdminTokenValidationResult,
	PugJwtPayload,
} from "@/types/client/auth";

export function validateAdminToken(token: string): AdminTokenValidationResult {
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
