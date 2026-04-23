import { z } from "zod";

import { accounts } from "@/api";
import { AccountResponseSchema } from "@/schemas/api";
import { routeError, routeWithAuthRetry } from "@/utils/route";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ slug?: string[] }> },
) {
	const { slug = [] } = await params;
	if (slug.length === 0) {
		const q = new URL(request.url).searchParams.get("q") ?? undefined;
		return routeWithAuthRetry(
			token => accounts.list(token, q),
			z.array(AccountResponseSchema),
		);
	}
	if (slug.length === 1 && slug[0] === "me") {
		return routeWithAuthRetry(
			token => accounts.getMe(token),
			AccountResponseSchema,
		);
	}
	if (slug.length === 2 && slug[0] === "by-email") {
		return routeWithAuthRetry(
			token => accounts.getByEmail(slug[1]!, token),
			AccountResponseSchema,
		);
	}
	if (slug.length === 2 && slug[0] === "by-cpf") {
		return routeWithAuthRetry(
			token => accounts.listByCpf(slug[1]!, token),
			z.array(AccountResponseSchema),
		);
	}
	if (slug.length === 1) {
		return routeWithAuthRetry(
			token => accounts.get(slug[0]!, token),
			AccountResponseSchema,
		);
	}
	return routeError(new Error("Not found"));
}
