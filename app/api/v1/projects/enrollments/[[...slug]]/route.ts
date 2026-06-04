import { z } from "zod";

import { enrollments } from "@/api";
import {
	EnrollmentComplexSearchRequestSchema,
	EnrollmentComplexSearchResponseSchema,
	EnrollmentResponseSchema,
	EnrollmentUpdateStatusRequestSchema,
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

	if (slug.length === 2) {
		return routeWithAuthRetry(
			token => enrollments.get(slug[0]!, slug[1]!, token),
			EnrollmentResponseSchema,
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

	if (slug.length === 1) {
		const url = new URL(request.url);
		const formerStudentId = url.searchParams.get("formerStudentId") ?? undefined;
		return routeWithAuthRetry(
			token => enrollments.create(slug[0]!, formerStudentId, token),
			EnrollmentResponseSchema,
		);
	}

	return routeError(new Error("Not found"));
}

export async function PATCH(request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;

	if (slug.length === 2 && slug[1] === "me") {
		const body = await parseRouteBody(request, EnrollmentUpdateStatusRequestSchema);
		return routeWithAuthRetry(
			token => enrollments.updateMyStatus(slug[0]!, body.status, token),
			EnrollmentResponseSchema,
		);
	}

	if (slug.length === 2) {
		const body = await parseRouteBody(request, EnrollmentUpdateStatusRequestSchema);
		return routeWithAuthRetry(
			token => enrollments.updateStatus(slug[0]!, slug[1]!, body.status, token),
			EnrollmentResponseSchema,
		);
	}

	return routeError(new Error("Not found"));
}

export async function DELETE(
	_request: Request,
	{ params }: AppRouteSlugContext,
) {
	const { slug = [] } = await params;
	if (slug.length !== 2) {
		return routeError(new Error("Not found"));
	}

	return routeVoidWithAuthRetry(token =>
		enrollments.deleteEnrollment(slug[0]!, slug[1]!, token),
	);
}
