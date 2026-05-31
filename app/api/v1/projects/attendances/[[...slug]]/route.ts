import { z } from "zod";

import { attendances } from "@/api";
import {
	AttendanceComplexSearchRequestSchema,
	AttendanceComplexSearchResponseSchema,
	AttendanceCreateRequestSchema,
	AttendanceResponseSchema,
	AttendanceValidateRequestSchema,
	PaginationRequestSchema,
	createPageResponseSchema,
} from "@/schemas/api";
import type { AppRouteSlugContext } from "@/types/client";
import {
	parseRouteBody,
	routeError,
	routeVoidWithAuthRetry,
	routeWithAuthRetry,
} from "@/utils/route";

export async function GET(request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;
	if (slug.length === 0) {
		const ids =
			new URL(request.url)
				.searchParams.get("ids")
				?.split(",")
				.filter(Boolean) ?? undefined;
		return routeWithAuthRetry(
			token => attendances.list(token, ids),
			z.array(AttendanceResponseSchema),
		);
	}
	if (slug.length === 1) {
		return routeWithAuthRetry(
			token => attendances.get(slug[0]!, token),
			AttendanceResponseSchema,
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
			AttendanceComplexSearchRequestSchema,
		);
		return routeWithAuthRetry(
			token => attendances.search(pagination, body, token),
			createPageResponseSchema(AttendanceComplexSearchResponseSchema),
		);
	}

	const body = await parseRouteBody(request, AttendanceCreateRequestSchema);
	return routeWithAuthRetry(
		token => attendances.create(body, token),
		AttendanceResponseSchema,
	);
}

export async function PATCH(request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;
	if (slug.length === 2 && slug[1] === "validate") {
		const body = await parseRouteBody(request, AttendanceValidateRequestSchema);
		return routeWithAuthRetry(
			token => attendances.validate(slug[0]!, body, token),
			AttendanceResponseSchema,
		);
	}
	return routeError(new Error("Not found"));
}

export async function DELETE(
	_request: Request,
	{ params }: AppRouteSlugContext,
) {
	const { slug = [] } = await params;
	if (slug.length !== 1) return routeError(new Error("Not found"));
	return routeVoidWithAuthRetry(token => attendances.remove(slug[0]!, token));
}
