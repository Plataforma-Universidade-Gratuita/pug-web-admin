import { z } from "zod";

import { users } from "@/api";
import {
	createPageResponseSchema,
	PaginationRequestSchema,
	UserComplexSearchRequestSchema,
	UserResponseSchema,
} from "@/schemas/api";
import type { AppRouteSlugContext } from "@/types/client";
import { parseRouteBody, routeError, routeWithAuthRetry } from "@/utils/route";

export async function GET(request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;
	if (slug.length === 0) {
		const ids =
			new URL(request.url).searchParams
				.get("ids")
				?.split(",")
				.filter(Boolean) ?? undefined;
		return routeWithAuthRetry(
			token => users.list(token, ids),
			z.array(UserResponseSchema),
		);
	}
	if (slug.length === 1 && slug[0] === "me") {
		return routeWithAuthRetry(token => users.getMe(token), UserResponseSchema);
	}
	if (slug.length === 1) {
		return routeWithAuthRetry(
			token => users.get(slug[0]!, token),
			UserResponseSchema,
		);
	}
	return routeError(new Error("Not found"));
}

export async function POST(request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;

	if (slug.length === 1 && slug[0] === "search") {
		const url = new URL(request.url);
		const pagination = PaginationRequestSchema.parse({
			page: url.searchParams.get("page"),
			size: url.searchParams.get("size"),
		});
		const body = await parseRouteBody(request, UserComplexSearchRequestSchema);

		return routeWithAuthRetry(
			token => users.search(pagination, body, token),
			createPageResponseSchema(UserResponseSchema),
		);
	}

	return routeError(new Error("Not found"));
}
