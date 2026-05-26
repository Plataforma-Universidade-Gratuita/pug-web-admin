import { z } from "zod";

import { cities } from "@/api";
import {
	CityComplexSearchRequestSchema,
	CityResponseSchema,
	PaginationRequestSchema,
	createPageResponseSchema,
} from "@/schemas/api";
import type { AppRouteSlugContext } from "@/types/client";
import { parseRouteBody, routeError, routeWithAuthRetry } from "@/utils/route";

export async function GET(_request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;
	if (slug.length === 0) {
		return routeWithAuthRetry(
			token => cities.list(token),
			z.array(CityResponseSchema),
		);
	}
	if (slug.length === 1) {
		return routeWithAuthRetry(
			token => cities.get(slug[0]!, token),
			CityResponseSchema,
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
		const body = await parseRouteBody(request, CityComplexSearchRequestSchema);

		return routeWithAuthRetry(
			token => cities.search(pagination, body, token),
			createPageResponseSchema(CityResponseSchema),
		);
	}

	return routeError(new Error("Not found"));
}
