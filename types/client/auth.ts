export interface PugJwtPayload {
	upn: string;
	groups: ("ADMIN" | "PARTNER" | "STUDENT")[];
	accountId: string;
	userId: string;
	iat: number;
	exp: number;
}

export interface AdminTokenValidationResult {
	isValid: boolean;
	payload?: PugJwtPayload;
}
