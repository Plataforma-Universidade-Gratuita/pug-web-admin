import { randomUUID } from "node:crypto";

import { mockAdmin, mockUser } from "./data.mjs";

const accessTtlSeconds = 60 * 60;
const refreshTtlSeconds = 60 * 60 * 24 * 7;
const refreshSessions = new Map();

function base64urlJson(value) {
	return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function createJwt(email, accountId, userId, expiresInSeconds) {
	const issuedAt = Math.floor(Date.now() / 1000);
	const payload = {
		upn: email,
		groups: ["ADMIN"],
		accountId,
		userId,
		iat: issuedAt,
		exp: issuedAt + expiresInSeconds,
	};

	return [
		base64urlJson({ alg: "none", typ: "JWT" }),
		base64urlJson(payload),
		"mock-signature",
	].join(".");
}

function issueTokens(email = mockAdmin.accountResponse.email) {
	const accountId = mockAdmin.accountResponse.id;
	const userId = mockAdmin.accountResponse.userId;
	const token = createJwt(email, accountId, userId, accessTtlSeconds);
	const refreshToken = `mock-refresh-${randomUUID()}`;

	refreshSessions.set(refreshToken, {
		email,
		accountId,
		userId,
		expiresAt: Date.now() + refreshTtlSeconds * 1000,
	});

	return {
		token,
		refreshToken,
		accountId,
		accountType: "ADMIN",
		expiresIn: accessTtlSeconds,
		refreshExpiresIn: refreshTtlSeconds,
	};
}

function refreshTokens(refreshToken) {
	const session = refreshSessions.get(refreshToken);
	if (!session) return null;
	if (session.expiresAt < Date.now()) {
		refreshSessions.delete(refreshToken);
		return null;
	}

	refreshSessions.delete(refreshToken);
	return issueTokens(session.email);
}

function getAdminByToken(authorizationHeader) {
	if (!authorizationHeader?.startsWith("Bearer ")) return null;
	return {
		...mockAdmin,
		accountResponse: {
			...mockAdmin.accountResponse,
		},
	};
}

function readJson(request) {
	return new Promise((resolve, reject) => {
		let raw = "";
		request.on("data", chunk => {
			raw += chunk;
		});
		request.on("end", () => {
			if (!raw) {
				resolve({});
				return;
			}

			try {
				resolve(JSON.parse(raw));
			} catch (error) {
				reject(error);
			}
		});
		request.on("error", reject);
	});
}

function success(data, status = 200) {
	return {
		status,
		body: {
			success: true,
			data,
			error: null,
			timestamp: new Date().toISOString(),
			correlationId: null,
		},
	};
}

function noContent() {
	return {
		status: 204,
		body: null,
	};
}

function error(status, code, message, details = null) {
	return {
		status,
		body: {
			success: false,
			data: null,
			error: {
				code,
				message,
				details,
			},
			timestamp: new Date().toISOString(),
			correlationId: null,
		},
	};
}

export const mockHandlers = [
	{
		method: "POST",
		path: "/auth/login",
		async handle(request) {
			const body = await readJson(request);
			const email =
				typeof body.email === "string" && body.email.trim().length > 0
					? body.email.trim()
					: mockAdmin.accountResponse.email;

			return success(issueTokens(email));
		},
	},
	{
		method: "POST",
		path: "/auth/refresh",
		async handle(request) {
			const body = await readJson(request);
			if (typeof body.refreshToken !== "string") {
				return error(400, "BAD_REQUEST", "refreshToken is required.");
			}

			const tokens = refreshTokens(body.refreshToken);
			if (!tokens) {
				return error(401, "UNAUTHORIZED", "Refresh token is invalid.");
			}

			return success(tokens);
		},
	},
	{
		method: "POST",
		path: "/auth/logout",
		async handle(request) {
			const body = await readJson(request);
			if (typeof body.refreshToken === "string") {
				refreshSessions.delete(body.refreshToken);
			}
			return noContent();
		},
	},
	{
		method: "POST",
		path: "/auth/logout-all",
		async handle() {
			refreshSessions.clear();
			return noContent();
		},
	},
	{
		method: "GET",
		path: "/identity/accounts/me",
		async handle(request) {
			const admin = getAdminByToken(request.headers.authorization);
			if (!admin) {
				return error(401, "UNAUTHORIZED", "Missing bearer token.");
			}

			return success(admin.accountResponse);
		},
	},
	{
		method: "GET",
		path: "/identity/admins/me",
		async handle(request) {
			const admin = getAdminByToken(request.headers.authorization);
			if (!admin) {
				return error(401, "UNAUTHORIZED", "Missing bearer token.");
			}

			return success(admin);
		},
	},
	{
		method: "GET",
		path: "/identity/users/me",
		async handle(request) {
			const admin = getAdminByToken(request.headers.authorization);
			if (!admin) {
				return error(401, "UNAUTHORIZED", "Missing bearer token.");
			}

			return success(mockUser);
		},
	},
	{
		method: "GET",
		path: "/identity/admins",
		async handle(request) {
			const admin = getAdminByToken(request.headers.authorization);
			if (!admin) {
				return error(401, "UNAUTHORIZED", "Missing bearer token.");
			}

			return success([admin]);
		},
	},
];
