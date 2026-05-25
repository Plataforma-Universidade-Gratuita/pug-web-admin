import { z } from "zod";

import { enrollments } from "@/api";
import {
	EnrollmentCreateRequestSchema,
	EnrollmentResponseSchema,
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
		const studentId = searchParams.get("studentId") ?? undefined;
		return routeWithAuthRetry(
			token => enrollments.list(token, projectId, studentId),
			z.array(EnrollmentResponseSchema),
		);
	}
	if (slug.length === 1 && slug[0] === "me") {
		return routeWithAuthRetry(
			token => enrollments.listMine(token),
			z.array(EnrollmentResponseSchema),
		);
	}
	if (slug.length === 2 && slug[1] === "me") {
		return routeWithAuthRetry(
			token => enrollments.getMine(slug[0]!, token),
			EnrollmentResponseSchema,
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

export async function POST(request: Request) {
	const body = await parseRouteBody(request, EnrollmentCreateRequestSchema);
	return routeWithAuthRetry(
		token => enrollments.create(body, token),
		EnrollmentResponseSchema,
	);
}

export async function PATCH(
	_request: Request,
	{ params }: AppRouteSlugContext,
) {
	const { slug = [] } = await params;
	if (slug.length === 2 && slug[1] === "exit") {
		return routeWithAuthRetry(
			token => enrollments.exit(slug[0]!, token),
			EnrollmentResponseSchema,
		);
	}
	if (slug.length === 3 && slug[2] === "accept") {
		return routeWithAuthRetry(
			token => enrollments.accept(slug[0]!, slug[1]!, token),
			EnrollmentResponseSchema,
		);
	}
	if (slug.length === 3 && slug[2] === "cancel") {
		return routeWithAuthRetry(
			token => enrollments.cancel(slug[0]!, slug[1]!, token),
			EnrollmentResponseSchema,
		);
	}
	if (slug.length === 3 && slug[2] === "complete") {
		return routeWithAuthRetry(
			token => enrollments.complete(slug[0]!, slug[1]!, token),
			EnrollmentResponseSchema,
		);
	}
	if (slug.length === 3 && slug[2] === "reject") {
		return routeWithAuthRetry(
			token => enrollments.reject(slug[0]!, slug[1]!, token),
			EnrollmentResponseSchema,
		);
	}
	if (slug.length === 3 && slug[2] === "remove") {
		return routeWithAuthRetry(
			token => enrollments.remove(slug[0]!, slug[1]!, token),
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
	if (slug.length !== 2) return routeError(new Error("Not found"));
	return routeVoidWithAuthRetry(token =>
		enrollments.deleteEnrollment(slug[0]!, slug[1]!, token),
	);
}