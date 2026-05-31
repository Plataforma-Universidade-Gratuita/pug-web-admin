import { z } from "zod";

import { formerStudents } from "@/api";
import {
	AccountStatusRequestSchema,
	createPageResponseSchema,
	FormerStudentComplexSearchRequestSchema,
	FormerStudentComplexSearchResponseSchema,
	FormerStudentCreateRequestSchema,
	FormerStudentResponseSchema,
	FormerStudentUpdateRequestSchema,
	PaginationRequestSchema,
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
			new URL(request.url).searchParams
				.get("ids")
				?.split(",")
				.filter(Boolean) ?? undefined;
		return routeWithAuthRetry(
			token => formerStudents.list(token, ids),
			z.array(FormerStudentResponseSchema),
		);
	}
	if (slug.length === 1 && slug[0] === "me") {
		return routeWithAuthRetry(
			token => formerStudents.getMe(token),
			FormerStudentResponseSchema,
		);
	}
	if (slug.length === 1) {
		return routeWithAuthRetry(
			token => formerStudents.get(slug[0]!, token),
			FormerStudentResponseSchema,
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
			FormerStudentComplexSearchRequestSchema,
		);
		return routeWithAuthRetry(
			token => formerStudents.search(pagination, body, token),
			createPageResponseSchema(FormerStudentComplexSearchResponseSchema),
		);
	}
	if (slug.length === 1 && slug[0] === "bulk") {
		const body = await parseRouteBody(
			request,
			z.array(FormerStudentCreateRequestSchema),
		);
		return routeWithAuthRetry(
			token => formerStudents.createBulk(body, token),
			z.array(FormerStudentResponseSchema),
		);
	}

	const body = await parseRouteBody(request, FormerStudentCreateRequestSchema);
	return routeWithAuthRetry(
		token => formerStudents.create(body, token),
		FormerStudentResponseSchema,
	);
}

export async function PUT(request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;
	if (slug.length !== 1) return routeError(new Error("Not found"));
	const body = await parseRouteBody(request, FormerStudentUpdateRequestSchema);
	return routeWithAuthRetry(
		token => formerStudents.update(slug[0]!, body, token),
		FormerStudentResponseSchema,
	);
}

export async function PATCH(request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;
	if (slug.length !== 2 || slug[1] !== "status") {
		return routeError(new Error("Not found"));
	}
	const body = await parseRouteBody(request, AccountStatusRequestSchema);
	return routeVoidWithAuthRetry(token =>
		formerStudents.setActive(slug[0]!, body.active, token),
	);
}

export async function DELETE(
	_request: Request,
	{ params }: AppRouteSlugContext,
) {
	const { slug = [] } = await params;
	if (slug.length !== 1) return routeError(new Error("Not found"));
	return routeVoidWithAuthRetry(token =>
		formerStudents.remove(slug[0]!, token),
	);
}
