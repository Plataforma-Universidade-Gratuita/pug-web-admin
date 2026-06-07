import { z } from "zod";

import { API_BASE_URL, JSON_HEADERS } from "@/constants";
import { ACCESS_TOKEN_COOKIE } from "@/constants";
import { ApiEnvelopeErrorSchema } from "@/schemas/api";
import type { ApiErrorBody, FieldError } from "@/types/api";

export class ApiError extends Error {
	public readonly status: number;
	public readonly code: string;
	public readonly details: FieldError[] | null;
	public readonly correlationId: string | null;

	constructor(
		status: number,
		body: ApiErrorBody,
		correlationId: string | null,
	) {
		super(body.message);
		this.name = "ApiError";
		this.status = status;
		this.code = body.code;
		this.details = body.details ?? null;
		this.correlationId = correlationId;
	}

	get fieldErrors(): Record<string, string[]> {
		if (!this.details) return {};
		return Object.fromEntries(
			this.details.map(f => [f.field, f.errors.map(e => e.message)]),
		);
	}
}

function authHeaders(token?: string): Record<string, string> {
	const headers: Record<string, string> = { ...JSON_HEADERS };
	if (token) headers.Authorization = `Bearer ${token}`;
	return headers;
}

async function resolveAccessToken(
	explicitToken?: string,
): Promise<string | undefined> {
	if (explicitToken) return explicitToken;
	if (typeof window !== "undefined") return undefined;

	try {
		const { cookies } = await import("next/headers");
		return (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
	} catch {
		return undefined;
	}
}

async function handleError(response: Response): Promise<never> {
	try {
		const json = await response.json();
		const envelope = ApiEnvelopeErrorSchema.parse(json);
		throw new ApiError(response.status, envelope.error, envelope.correlationId);
	} catch (error) {
		if (error instanceof ApiError) throw error;
		console.error("Failed to parse API error envelope:", error);
		throw new Error(`HTTP ${response.status}`);
	}
}

export async function zfetch<T extends z.ZodTypeAny>(
	path: string,
	init: RequestInit,
	schema: T,
	token?: string,
): Promise<z.infer<T>> {
	const accessToken = await resolveAccessToken(token);
	const response = await fetch(`${API_BASE_URL}${path}`, {
		...init,
		headers: { ...authHeaders(accessToken), ...init.headers },
	});
	if (!response.ok) return handleError(response);

	const json = await response.json();
	return schema.parse(json.data) as z.infer<T>;
}

export async function zvoid(
	path: string,
	init: RequestInit,
	token?: string,
): Promise<void> {
	const accessToken = await resolveAccessToken(token);
	const response = await fetch(`${API_BASE_URL}${path}`, {
		...init,
		headers: { ...authHeaders(accessToken), ...init.headers },
	});
	if (!response.ok) return handleError(response);
}

export function qs(params: Record<string, string | undefined | null>): string {
	const entries = Object.entries(params).filter(
		(entry): entry is [string, string] => entry[1] != null && entry[1] !== "",
	);
	if (entries.length === 0) return "";
	return "?" + new URLSearchParams(entries).toString();
}
