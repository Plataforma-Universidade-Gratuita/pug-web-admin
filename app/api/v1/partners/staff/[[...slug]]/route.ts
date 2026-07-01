import { z } from "zod";

import { staff } from "@/api/services";
import {
	getRepeatedQueryParams,
	parseRouteBody,
	routeError,
	routeVoidWithAuthRetry,
	routeWithAuthRetry,
} from "@/app/api/utils";
import {
	AccountStatusRequestSchema,
	PaginationRequestSchema,
	StaffComplexSearchRequestSchema,
	StaffComplexSearchResponseSchema,
	StaffCreateRequestSchema,
	StaffResponseSchema,
	StaffUpdateRequestSchema,
	createPageResponseSchema,
} from "@/schemas/api";
import type { AppRouteSlugContext } from "@/types/client";

export async function GET(request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;
	if (slug.length === 0) {
		const ids = getRepeatedQueryParams(request, "ids");
		return routeWithAuthRetry(
			token => staff.list(token, ids),
			z.array(StaffResponseSchema),
		);
	}
	if (slug.length === 1 && slug[0] === "me") {
		return routeWithAuthRetry(token => staff.getMe(token), StaffResponseSchema);
	}
	if (slug.length === 1) {
		return routeWithAuthRetry(
			token => staff.get(slug[0]!, token),
			StaffResponseSchema,
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
		const body = await parseRouteBody(request, StaffComplexSearchRequestSchema);
		return routeWithAuthRetry(
			token => staff.search(pagination, body, token),
			createPageResponseSchema(StaffComplexSearchResponseSchema),
		);
	}

	const body = await parseRouteBody(request, StaffCreateRequestSchema);
	return routeWithAuthRetry(
		token => staff.create(body, token),
		StaffResponseSchema,
	);
}

export async function PUT(request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;
	if (slug.length !== 1) return routeError(new Error("Not found"));
	const body = await parseRouteBody(request, StaffUpdateRequestSchema);
	return routeWithAuthRetry(
		token => staff.update(slug[0]!, body, token),
		StaffResponseSchema,
	);
}

export async function PATCH(request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;
	if (slug.length !== 2 || slug[1] !== "status") {
		return routeError(new Error("Not found"));
	}

	const body = await parseRouteBody(request, AccountStatusRequestSchema);
	return routeVoidWithAuthRetry(token =>
		staff.setActive(slug[0]!, body.active, token),
	);
}

export async function DELETE(
	_request: Request,
	{ params }: AppRouteSlugContext,
) {
	const { slug = [] } = await params;
	if (slug.length !== 1) return routeError(new Error("Not found"));
	return routeVoidWithAuthRetry(token => staff.remove(slug[0]!, token));
}
