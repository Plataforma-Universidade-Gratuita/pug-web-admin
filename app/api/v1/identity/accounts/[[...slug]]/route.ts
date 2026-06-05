import { z } from "zod";

import { accounts } from "@/api";
import {
	AccountComplexSearchRequestSchema,
	AccountResponseSchema,
	AccountSearchResponseSchema,
	createPageResponseSchema,
	PaginationRequestSchema,
} from "@/schemas/api";
import type { AppRouteSlugContext } from "@/types/client";
import {
	parseRouteBody,
	routeError,
	routeWithAuthRetry,
} from "@/utils/server/http/route";

export async function GET(request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;
	if (slug.length === 0) {
		const ids =
			new URL(request.url).searchParams
				.get("ids")
				?.split(",")
				.filter(Boolean) ?? undefined;
		return routeWithAuthRetry(
			token => accounts.list(token, ids),
			z.array(AccountResponseSchema),
		);
	}
	if (slug.length === 1 && slug[0] === "me") {
		return routeWithAuthRetry(
			token => accounts.getMe(token),
			AccountResponseSchema,
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

export async function POST(request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;

	if (slug.length === 1 && slug[0] === "search") {
		const url = new URL(request.url);
		const pagination = PaginationRequestSchema.parse({
			page: url.searchParams.get("page"),
			size: url.searchParams.get("size"),
		});
		const body = await parseRouteBody(
			request,
			AccountComplexSearchRequestSchema,
		);

		return routeWithAuthRetry(
			token => accounts.search(pagination, body, token),
			createPageResponseSchema(AccountSearchResponseSchema),
		);
	}

	return routeError(new Error("Not found"));
}
