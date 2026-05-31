import { z } from "zod";

import { enrollments } from "@/api";
import {
	EnrollmentComplexSearchRequestSchema,
	EnrollmentComplexSearchResponseSchema,
	EnrollmentResponseSchema,
	PaginationRequestSchema,
	createPageResponseSchema,
} from "@/schemas/api";
import type { AppRouteSlugContext } from "@/types/client";
import { parseRouteBody, routeError, routeWithAuthRetry } from "@/utils/route";

export async function GET(request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;
	if (slug.length === 0) {
		const searchParams = new URL(request.url).searchParams;
		const projectId = searchParams.get("projectId") ?? undefined;
		const formerStudentId = searchParams.get("formerStudentId") ?? undefined;
		return routeWithAuthRetry(
			token => enrollments.list(token, projectId, formerStudentId),
			z.array(EnrollmentResponseSchema),
		);
	}
	if (slug.length === 1 && slug[0] === "me") {
		return routeWithAuthRetry(
			token => enrollments.listMine(token),
			z.array(EnrollmentResponseSchema),
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
			EnrollmentComplexSearchRequestSchema,
		);
		return routeWithAuthRetry(
			token => enrollments.search(pagination, body, token),
			createPageResponseSchema(EnrollmentComplexSearchResponseSchema),
		);
	}
	return routeError(new Error("Not found"));
}
