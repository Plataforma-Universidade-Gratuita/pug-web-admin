/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */

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
	password: string | null;
}

export interface WireCredentialsFormValues {
	email: string;
	password: string | null;
	confirmPassword: string;
}
