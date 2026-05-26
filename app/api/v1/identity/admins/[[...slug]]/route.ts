import { z } from "zod";

import { admins } from "@/api";
import {
	AdminComplexSearchRequestSchema,
	AdminCreateRequestSchema,
	AdminResponseSchema,
	AdminSearchResponseSchema,
	AdminUpdateRequestSchema,
	createPageResponseSchema,
	PaginationRequestSchema,
} from "@/schemas/api";
import type { AppRouteSlugContext } from "@/types/client";
import {
	parseRouteBody,
	routeError,
	routeVoidWithAuthRetry,
	routeWithAuthRetry,
} from "@/utils/route";

export async function GET(_request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;
	if (slug.length === 1 && slug[0] === "me") {
		return routeWithAuthRetry(
			token => admins.getMe(token),
			AdminResponseSchema,
		);
	}
	if (slug.length === 1) {
		return routeWithAuthRetry(
			token => admins.get(slug[0]!, token),
			AdminResponseSchema,
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
		const body = await parseRouteBody(request, AdminComplexSearchRequestSchema);
		return routeWithAuthRetry(
			token => admins.search(pagination, body, token),
			createPageResponseSchema(AdminSearchResponseSchema),
		);
	}

	const body = await parseRouteBody(request, AdminCreateRequestSchema);
	return routeWithAuthRetry(
		token => admins.create(body, token),
		AdminResponseSchema,
	);
}

export async function PUT(request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;
	if (slug.length !== 1) return routeError(new Error("Not found"));
	const body = await parseRouteBody(request, AdminUpdateRequestSchema);
	return routeWithAuthRetry(
		token => admins.update(slug[0]!, body, token),
		AdminResponseSchema,
	);
}

export async function PATCH(request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;
	if (slug.length !== 1) {
		return routeError(new Error("Not found"));
	}

	const body = await parseRouteBody(request, z.object({ active: z.boolean() }));
	return routeVoidWithAuthRetry(token =>
		admins.setActive(slug[0]!, body.active, token),
	);
}

export async function DELETE(
	_request: Request,
	{ params }: AppRouteSlugContext,
) {
	const { slug = [] } = await params;
	if (slug.length !== 1) return routeError(new Error("Not found"));
	return routeVoidWithAuthRetry(token => admins.remove(slug[0]!, token));
}
