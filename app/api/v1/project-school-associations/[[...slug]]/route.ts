import { z } from "zod";

import { projectSchools } from "@/api";
import {
	ProjectResponseSchema,
	ProjectSchoolRequestSchema,
	SchoolResponseSchema,
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
	if (slug.length === 3 && slug[0] === "projects" && slug[2] === "schools") {
		return routeWithAuthRetry(
			token => projectSchools.listSchoolsByProject(slug[1]!, token),
			z.array(SchoolResponseSchema),
		);
	}
	if (slug.length === 3 && slug[0] === "schools" && slug[2] === "projects") {
		return routeWithAuthRetry(
			token => projectSchools.listProjectsBySchool(slug[1]!, token),
			z.array(ProjectResponseSchema),
		);
	}
	return routeError(new Error("Not found"));
}

export async function POST(request: Request) {
	const body = await parseRouteBody(request, ProjectSchoolRequestSchema);
	return routeWithAuthRetry(
		token => projectSchools.createAssociations(body, token),
		z.array(SchoolResponseSchema),
	);
}

export async function DELETE(
	_request: Request,
	{ params }: AppRouteSlugContext,
) {
	const { slug = [] } = await params;
	if (slug.length === 4 && slug[0] === "projects" && slug[2] === "schools") {
		return routeVoidWithAuthRetry(token =>
			projectSchools.deleteAssociation(slug[1]!, slug[3]!, token),
		);
	}
	if (slug.length === 2 && slug[0] === "projects") {
		return routeVoidWithAuthRetry(token =>
			projectSchools.deleteAllByProject(slug[1]!, token),
		);
	}
	if (slug.length === 2 && slug[0] === "schools") {
		return routeVoidWithAuthRetry(token =>
			projectSchools.deleteAllBySchool(slug[1]!, token),
		);
	}
	return routeError(new Error("Not found"));
}
