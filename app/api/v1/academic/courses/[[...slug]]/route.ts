import { z } from "zod";

import { courses } from "@/api/services";
import {
	parseRouteBody,
	routeError,
	routeVoidWithAuthRetry,
	routeWithAuthRetry,
} from "@/app/api/utils";
import {
	CourseComplexSearchRequestSchema,
	CourseCreateRequestSchema,
	CourseResponseSchema,
	CourseUpdateRequestSchema,
	CourseWithAuditInfoComplexSearchResponseSchema,
	createPageResponseSchema,
	PaginationRequestSchema,
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
			token => courses.list(token, ids),
			z.array(CourseResponseSchema),
		);
	}
	if (slug.length === 1) {
		return routeWithAuthRetry(
			token => courses.get(slug[0]!, token),
			CourseResponseSchema,
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
			CourseComplexSearchRequestSchema,
		);
		return routeWithAuthRetry(
			token => courses.search(pagination, body, token),
			createPageResponseSchema(CourseWithAuditInfoComplexSearchResponseSchema),
		);
	}

	const body = await parseRouteBody(request, CourseCreateRequestSchema);
	return routeWithAuthRetry(
		token => courses.create(body, token),
		CourseResponseSchema,
	);
}

export async function PUT(request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;
	if (slug.length !== 1) return routeError(new Error("Not found"));
	const body = await parseRouteBody(request, CourseUpdateRequestSchema);
	return routeWithAuthRetry(
		token => courses.update(slug[0]!, body, token),
		CourseResponseSchema,
	);
}

export async function DELETE(
	_request: Request,
	{ params }: AppRouteSlugContext,
) {
	const { slug = [] } = await params;
	if (slug.length !== 1) return routeError(new Error("Not found"));
	return routeVoidWithAuthRetry(token => courses.remove(slug[0]!, token));
}
