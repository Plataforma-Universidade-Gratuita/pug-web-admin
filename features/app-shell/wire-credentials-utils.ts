export interface WireCredentialsPasswordRequirements {
	hasMinimumLength: boolean;
	hasUppercaseLetter: boolean;
	hasLowercaseLetter: boolean;
	hasNumber: boolean;
	hasSpecialSymbol: boolean;
}

export function evaluateWireCredentialsPasswordRequirements(
	password: string,
): WireCredentialsPasswordRequirements {
	return {
		hasMinimumLength: password.length >= 8,
		hasUppercaseLetter: /[A-Z]/.test(password),
		hasLowercaseLetter: /[a-z]/.test(password),
		hasNumber: /\d/.test(password),
		hasSpecialSymbol: /[^A-Za-z0-9]/.test(password),
	};
}

export function doesWireCredentialsPasswordMeetRequirements(password: string) {
	const requirements = evaluateWireCredentialsPasswordRequirements(password);

	return Object.values(requirements).every(Boolean);
}
