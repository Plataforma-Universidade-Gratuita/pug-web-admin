import { z } from "zod";

// ─── Base URL ────────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
const ACCESS_TOKEN_COOKIE = "accessToken";

// ─── API Error Types & Schema ────────────────────────────────────────────────

const FieldErrorDetailSchema = z.object({
	code: z.string(),
	message: z.string(),
});

const FieldErrorSchema = z.object({
	field: z.string(),
	errors: z.array(FieldErrorDetailSchema),
});

const ApiErrorSchema = z.object({
	code: z.string(),
	message: z.string(),
	details: z.array(FieldErrorSchema).nullable().optional(),
});

const ApiEnvelopeErrorSchema = z.object({
	success: z.literal(false),
	data: z.null(),
	error: ApiErrorSchema,
	timestamp: z.string(),
	correlationId: z.string().nullable(),
});

export type FieldErrorDetail = z.infer<typeof FieldErrorDetailSchema>;
export type FieldError = z.infer<typeof FieldErrorSchema>;
export type ApiErrorBody = z.infer<typeof ApiErrorSchema>;

/**
 * Structured error thrown when the API returns a non-2xx response.
 * Contains the parsed error envelope with code, message, field errors, and correlation ID.
 */
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

	/** Returns a flat map of field → error messages for easy form integration. */
	get fieldErrors(): Record<string, string[]> {
		if (!this.details) return {};
		return Object.fromEntries(
			this.details.map((f) => [f.field, f.errors.map((e) => e.message)]),
		);
	}
}

// ─── Auth Header Helper ─────────────────────────────────────────────────────

function authHeaders(token?: string): HeadersInit {
	const headers: HeadersInit = { "Content-Type": "application/json" };
	if (token) headers["Authorization"] = `Bearer ${token}`;
	return headers;
}

async function resolveAccessToken(explicitToken?: string): Promise<string | undefined> {
	if (explicitToken) return explicitToken;
	if (typeof window !== "undefined") return undefined;

	try {
		const { cookies } = await import("next/headers");
		return (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
	} catch {
		return undefined;
	}
}

// ─── Error Handling ──────────────────────────────────────────────────────────

async function handleError(r: Response): Promise<never> {
	try {
		const json = await r.json();
		const envelope = ApiEnvelopeErrorSchema.parse(json);
		throw new ApiError(r.status, envelope.error, envelope.correlationId);
	} catch (e) {
		if (e instanceof ApiError) throw e;
		console.error("Failed to parse API error envelope:", e);
		throw new Error(`HTTP ${r.status}`);
	}
}

// ─── Typed Fetch Helpers ─────────────────────────────────────────────────────

/**
 * Performs a fetch request, validates the JSON response against the given
 * Zod schema, and returns the unwrapped `data` field from the API envelope.
 *
 * On error responses, throws an {@link ApiError} with the parsed code,
 * message, field-level details, and correlation ID from the backend.
 */
export async function zfetch<T extends z.ZodTypeAny>(
	path: string,
	init: RequestInit,
	schema: T,
	token?: string,
): Promise<z.infer<T>> {
	const accessToken = await resolveAccessToken(token);
	const r = await fetch(`${BASE_URL}${path}`, {
		...init,
		headers: { ...authHeaders(accessToken), ...init.headers },
	});
	if (!r.ok) return handleError(r);
	const json = await r.json();
	return schema.parse(json.data) as z.infer<T>;
}

/**
 * Performs a fetch request that expects no response body (204) or an envelope
 * with null data. Used for delete / deactivate / logout endpoints.
 *
 * On error responses, throws an {@link ApiError} with the parsed backend details.
 */
export async function zvoid(
	path: string,
	init: RequestInit,
	token?: string,
): Promise<void> {
	const accessToken = await resolveAccessToken(token);
	const r = await fetch(`${BASE_URL}${path}`, {
		...init,
		headers: { ...authHeaders(accessToken), ...init.headers },
	});
	if (!r.ok) return handleError(r);
}

// ─── Query String Helper ────────────────────────────────────────────────────

export function qs(params: Record<string, string | undefined | null>): string {
	const entries = Object.entries(params).filter(
		(entry): entry is [string, string] => entry[1] != null && entry[1] !== "",
	);
	if (entries.length === 0) return "";
	return "?" + new URLSearchParams(entries).toString();
}
