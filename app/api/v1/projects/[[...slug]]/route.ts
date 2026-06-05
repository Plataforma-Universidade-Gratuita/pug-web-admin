import { z } from "zod";

import { enrollments, projectAreasOfExpertise, projects } from "@/api";
import {
	AreaOfExpertiseResponseSchema,
	EnrollmentResponseSchema,
	EnrollmentUpdateStatusRequestSchema,
	PaginationRequestSchema,
	ProjectAreaOfExpertiseRequestSchema,
	ProjectComplexSearchRequestSchema,
	ProjectComplexSearchResponseSchema,
	ProjectCreateRequestSchema,
	ProjectResponseSchema,
	ProjectStatusEnum,
	ProjectUpdateRequestSchema,
	createPageResponseSchema,
} from "@/schemas/api";
import type { AppRouteSlugContext } from "@/types/client";
import {
	parseRouteBody,
	routeError,
	routeVoidWithAuthRetry,
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
			token => projects.list(token, ids),
			z.array(ProjectResponseSchema),
		);
	}
	if (slug.length === 2 && slug[0] === "entities") {
		return routeWithAuthRetry(
			token => projects.listByEntity(slug[1]!, token),
			z.array(ProjectResponseSchema),
		);
	}
	if (slug.length === 2 && slug[0] === "creators") {
		return routeWithAuthRetry(
			token => projects.listByCreatedBy(slug[1]!, token),
			z.array(ProjectResponseSchema),
		);
	}
	if (slug.length === 2 && slug[1] === "areas-of-expertise") {
		return routeWithAuthRetry(
			token =>
				projectAreasOfExpertise.listAreasOfExpertiseByProject(slug[0]!, token),
			z.array(AreaOfExpertiseResponseSchema),
		);
	}
	if (slug.length === 3 && slug[1] === "enrollments" && slug[2] === "me") {
		return routeWithAuthRetry(
			token => enrollments.getMine(slug[0]!, token),
			EnrollmentResponseSchema,
		);
	}
	if (slug.length === 3 && slug[1] === "enrollments") {
		return routeWithAuthRetry(
			token => enrollments.get(slug[0]!, slug[2]!, token),
			EnrollmentResponseSchema,
		);
	}
	if (slug.length === 1) {
		return routeWithAuthRetry(
			token => projects.get(slug[0]!, token),
			ProjectResponseSchema,
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
			ProjectComplexSearchRequestSchema,
		);
		return routeWithAuthRetry(
			token => projects.search(pagination, body, token),
			createPageResponseSchema(ProjectComplexSearchResponseSchema),
		);
	}

	if (slug.length === 2 && slug[1] === "areas-of-expertise") {
		const body = await parseRouteBody(
			request,
			ProjectAreaOfExpertiseRequestSchema,
		);
		return routeVoidWithAuthRetry(token =>
			projectAreasOfExpertise.createAssociations(slug[0]!, body, token),
		);
	}

	if (slug.length === 2 && slug[1] === "enrollments") {
		const formerStudentId =
			new URL(request.url).searchParams.get("formerStudentId") ?? undefined;
		return routeWithAuthRetry(
			token => enrollments.create(slug[0]!, formerStudentId, token),
			EnrollmentResponseSchema,
		);
	}

	const body = await parseRouteBody(request, ProjectCreateRequestSchema);
	return routeWithAuthRetry(
		token => projects.create(body, token),
		ProjectResponseSchema,
	);
}

export async function PUT(request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;
	if (slug.length !== 1) return routeError(new Error("Not found"));
	const body = await parseRouteBody(request, ProjectUpdateRequestSchema);
	return routeWithAuthRetry(
		token => projects.update(slug[0]!, body, token),
		ProjectResponseSchema,
	);
}

export async function PATCH(request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;
	if (slug.length === 2 && slug[1] === "status") {
		const status = await parseRouteBody(request, ProjectStatusEnum);
		return routeWithAuthRetry(
			token => projects.updateStatus(slug[0]!, status, token),
			ProjectResponseSchema,
		);
	}
	if (slug.length === 3 && slug[1] === "enrollments" && slug[2] === "me") {
		const body = await parseRouteBody(
			request,
			EnrollmentUpdateStatusRequestSchema,
		);
		return routeWithAuthRetry(
			token => enrollments.updateMyStatus(slug[0]!, body.status, token),
			EnrollmentResponseSchema,
		);
	}
	if (slug.length === 3 && slug[1] === "enrollments") {
		const body = await parseRouteBody(
			request,
			EnrollmentUpdateStatusRequestSchema,
		);
		return routeWithAuthRetry(
			token => enrollments.updateStatus(slug[0]!, slug[2]!, body.status, token),
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
	if (slug.length === 3 && slug[1] === "areas-of-expertise") {
		return routeVoidWithAuthRetry(token =>
			projectAreasOfExpertise.deleteAssociation(slug[0]!, slug[2]!, token),
		);
	}
	if (slug.length === 2 && slug[1] === "areas-of-expertise") {
		return routeVoidWithAuthRetry(token =>
			projectAreasOfExpertise.deleteAllByProject(slug[0]!, token),
		);
	}
	if (slug.length === 3 && slug[1] === "enrollments") {
		return routeVoidWithAuthRetry(token =>
			enrollments.deleteEnrollment(slug[0]!, slug[2]!, token),
		);
	}
	if (slug.length === 1) {
		return routeVoidWithAuthRetry(token => projects.remove(slug[0]!, token));
	}
	return routeError(new Error("Not found"));
}
