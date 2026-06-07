export interface PugJwtPayload {
	upn: string;
	groups: ("ADMIN" | "PARTNER" | "FORMER_STUDENT" | "STAFF")[];
	accountId: string;
	userId: string;
	iat: number;
	exp: number;
}

export interface AdminTokenValidationResult {
	isValid: boolean;
	payload?: PugJwtPayload;
}

export interface LoginFormValues {
	email: string;
	password: string;
}

export interface WireCredentialsFormValues {
	email: string;
	password: string;
	confirmPassword: string;
}
