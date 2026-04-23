import { z } from "zod";

import { users } from "@/api";
import { UserResponseSchema } from "@/schemas/api";
import { routeError, routeWithAuthRetry } from "@/utils/route";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ slug?: string[] }> },
) {
	const { slug = [] } = await params;
	if (slug.length === 0) {
		const q = new URL(request.url).searchParams.get("q") ?? undefined;
		return routeWithAuthRetry(
			(token) => users.list(token, q),
			z.array(UserResponseSchema),
		);
	}
	if (slug.length === 1 && slug[0] === "me") {
		return routeWithAuthRetry((token) => users.getMe(token), UserResponseSchema);
	}
	if (slug.length === 2 && slug[0] === "by-cpf") {
		return routeWithAuthRetry(
			(token) => users.getByCpf(slug[1]!, token),
			UserResponseSchema,
		);
	}
	if (slug.length === 1) {
		return routeWithAuthRetry(
			(token) => users.get(slug[0]!, token),
			UserResponseSchema,
		);
	}
	return routeError(new Error("Not found"));
}
