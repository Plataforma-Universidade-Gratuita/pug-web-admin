import { z } from "zod";

import { JSON_HEADERS } from "@/constants";

export { qs } from "@/api/utils";

export class WebApiError extends Error {
	public readonly status: number;
	public readonly code: string | undefined;

	constructor(status: number, message: string, code?: string) {
		super(message);
		this.name = "WebApiError";
		this.status = status;
		this.code = code;
	}
}

async function parseWebApiError(response: Response): Promise<never> {
	let message = `HTTP ${response.status}`;
	let code: string | undefined;

	try {
		const json = await response.json();
		if (typeof json?.message === "string") message = json.message;
		if (typeof json?.code === "string") code = json.code;
	} catch {
		// Fall back to the status text when no JSON error body is available.
	}

	throw new WebApiError(response.status, message, code);
}

function webRequest(path: string, init?: RequestInit): Promise<Response> {
	return fetch(path, {
		...init,
		cache: "no-store",
		credentials: "include",
		headers: { ...JSON_HEADERS, ...init?.headers },
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
