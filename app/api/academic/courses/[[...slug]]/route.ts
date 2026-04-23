import { z } from "zod";

import { courses } from "@/api";
import {
	CourseCreateRequestSchema,
	CourseResponseSchema,
	CourseUpdateRequestSchema,
} from "@/schemas/api";
import {
	parseRouteBody,
	routeError,
	routeVoidWithAuthRetry,
	routeWithAuthRetry,
} from "@/utils/route";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ slug?: string[] }> },
) {
	const { slug = [] } = await params;
	if (slug.length === 0) {
		const searchParams = new URL(request.url).searchParams;
		const q = searchParams.get("q") ?? undefined;
		const schoolId = searchParams.get("schoolId") ?? undefined;
		return routeWithAuthRetry(
			(token) => courses.list(token, q, schoolId),
			z.array(CourseResponseSchema),
		);
	}
	if (slug.length === 1) {
		return routeWithAuthRetry(
			(token) => courses.get(slug[0]!, token),
			CourseResponseSchema,
		);
	}
	return routeError(new Error("Not found"));
}

export async function POST(request: Request) {
	const body = await parseRouteBody(request, CourseCreateRequestSchema);
	return routeWithAuthRetry(
		(token) => courses.create(body, token),
		CourseResponseSchema,
	);
}

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ slug?: string[] }> },
) {
	const { slug = [] } = await params;
	if (slug.length !== 1) return routeError(new Error("Not found"));
	const body = await parseRouteBody(request, CourseUpdateRequestSchema);
	return routeWithAuthRetry(
		(token) => courses.update(slug[0]!, body, token),
		CourseResponseSchema,
	);
}

export async function DELETE(
	_request: Request,
	{ params }: { params: Promise<{ slug?: string[] }> },
) {
	const { slug = [] } = await params;
	if (slug.length !== 1) return routeError(new Error("Not found"));
	return routeVoidWithAuthRetry((token) => courses.remove(slug[0]!, token));
}
