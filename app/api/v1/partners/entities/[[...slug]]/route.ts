import { z } from "zod";

import { entities } from "@/api/services";
import {
	parseRouteBody,
	routeError,
	routeVoidWithAuthRetry,
	routeWithAuthRetry,
} from "@/app/api/utils";
import {
	EntityComplexSearchRequestSchema,
	EntityComplexSearchResponseSchema,
	EntityCreateRequestSchema,
	EntityResponseSchema,
	EntityUpdateRequestSchema,
	PaginationRequestSchema,
	createPageResponseSchema,
} from "@/schemas/api";
import type { AppRouteSlugContext } from "@/types/client";

export async function GET(request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;
	if (slug.length === 0) {
		const ids =
			new URL(request.url).searchParams
				.get("ids")
				?.split(",")
				.filter(Boolean) ?? undefined;
		return routeWithAuthRetry(
			token => entities.list(token, ids),
			z.array(EntityResponseSchema),
		);
	}
	if (slug.length === 1) {
		return routeWithAuthRetry(
			token => entities.get(slug[0]!, token),
			EntityResponseSchema,
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
			EntityComplexSearchRequestSchema,
		);
		return routeWithAuthRetry(
			token => entities.search(pagination, body, token),
			createPageResponseSchema(EntityComplexSearchResponseSchema),
		);
	}

	const body = await parseRouteBody(request, EntityCreateRequestSchema);
	return routeWithAuthRetry(
		token => entities.create(body, token),
		EntityResponseSchema,
	);
}

export async function PUT(request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;
	if (slug.length !== 1) return routeError(new Error("Not found"));
	const body = await parseRouteBody(request, EntityUpdateRequestSchema);
	return routeWithAuthRetry(
		token => entities.update(slug[0]!, body, token),
		EntityResponseSchema,
	);
}

export async function DELETE(
	_request: Request,
	{ params }: AppRouteSlugContext,
) {
	const { slug = [] } = await params;
	if (slug.length !== 1) return routeError(new Error("Not found"));
	return routeVoidWithAuthRetry(token => entities.remove(slug[0]!, token));
}
