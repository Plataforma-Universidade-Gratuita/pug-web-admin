const now = new Date();
const isoNow = now.toISOString();
const formattedNow = now.toLocaleString("en-US");
const auditInfo = {
	createdAt: isoNow,
	createdAtFormatted: formattedNow,
	updatedAt: isoNow,
	updatedAtFormatted: formattedNow,
};

export const mockUser = {
	id: "mock-user-admin-1",
	cpf: "12345678901",
	cpfFormatted: "123.456.789-01",
	name: "Mock Admin",
	auditInfo,
};

export const mockAdmin = {
	accountResponse: {
		id: "mock-account-admin-1",
		userId: mockUser.id,
		email: "admin@pug.edu.br",
		accountType: "ADMIN",
		accountTypeFormatted: "Administrator",
		auditInfo,
		active: true,
	},
	campus: {
		campus: "JOINVILLE",
		campusFormatted: "Joinville",
	},
	grantedAt: isoNow,
	grantedAtFormatted: formattedNow,
};
