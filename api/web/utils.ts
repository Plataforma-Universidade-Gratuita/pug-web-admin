import { z } from "zod";

import { JSON_HEADERS } from "@/constants";
import { ApiEnvelopeErrorSchema, ApiErrorSchema } from "@/schemas/api";
import type { ApiErrorBody, FieldError } from "@/types/api";

export class WebApiError extends Error {
	public readonly status: number;
	public readonly code: string | undefined;
	public readonly details: FieldError[] | null;
	public readonly correlationId: string | null;

	constructor(
		status: number,
		body: Pick<ApiErrorBody, "code" | "message" | "details">,
		correlationId: string | null = null,
	) {
		super(body.message);
		this.name = "WebApiError";
		this.status = status;
		this.code = body.code;
		this.details = body.details ?? null;
		this.correlationId = correlationId;
	}

	get fieldErrors(): Record<string, string[]> {
		if (!this.details) return {};
		return Object.fromEntries(
			this.details.map(field => [
				field.field,
				field.errors.map(error => error.message),
			]),
		);
	}
}

async function parseWebApiError(response: Response): Promise<never> {
	try {
		const json = await response.json();
		const envelopeResult = ApiEnvelopeErrorSchema.safeParse(json);
		if (envelopeResult.success) {
			throw new WebApiError(
				response.status,
				envelopeResult.data.error,
				envelopeResult.data.correlationId,
			);
		}

		const rawErrorResult = z
			.object({
				code: ApiErrorSchema.shape.code,
				message: ApiErrorSchema.shape.message,
				details: ApiErrorSchema.shape.details,
				correlationId: z.string().nullable().optional(),
			})
			.safeParse(json);
		if (rawErrorResult.success) {
			throw new WebApiError(
				response.status,
				{
					code: rawErrorResult.data.code,
					message: rawErrorResult.data.message,
					details: rawErrorResult.data.details ?? null,
				},
				rawErrorResult.data.correlationId ?? null,
			);
		}
	} catch (error) {
		if (error instanceof WebApiError) {
			throw error;
		}

		// Fall back to a minimal HTTP-shaped error when no valid envelope is available.
		throw new WebApiError(response.status, {
			code: `HTTP_${response.status}`,
			message: `HTTP ${response.status}`,
			details: null,
		});
	}

	throw new WebApiError(response.status, {
		code: `HTTP_${response.status}`,
		message: `HTTP ${response.status}`,
		details: null,
	});
}

function resolveClientLocaleHeader(): string | undefined {
	if (typeof document !== "undefined") {
		const documentLanguage = document.documentElement.lang?.trim();
		if (documentLanguage) {
			return documentLanguage;
		}
	}

	if (typeof navigator !== "undefined") {
		return navigator.language;
	}

	return undefined;
}

function webRequest(path: string, init?: RequestInit): Promise<Response> {
	const locale = resolveClientLocaleHeader();

	return fetch(path, {
		...init,
		cache: "no-store",
		credentials: "include",
		headers: {
			...JSON_HEADERS,
			...(locale ? { "Accept-Language": locale } : {}),
			...init?.headers,
		},
	});
}

export async function webFetch<T extends z.ZodTypeAny>(
	path: string,
	schema: T,
	init?: RequestInit,
): Promise<z.infer<T>> {
	const response = await webRequest(path, init);
	if (!response.ok) return parseWebApiError(response);

	const json = await response.json();
	return schema.parse(json) as z.infer<T>;
}

export async function webVoid(path: string, init?: RequestInit): Promise<void> {
	const response = await webRequest(path, init);
	if (!response.ok) return parseWebApiError(response);
}
