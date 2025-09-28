import { z } from "zod";

export async function zfetch<T extends z.ZodTypeAny>(
	input: RequestInfo,
	init: RequestInit,
	schema: T,
): Promise<z.infer<T>> {
	const r = await fetch(input, init);
	if (!r.ok) throw new Error(`HTTP ${r.status}`);
	return schema.parse(await r.json());
}
