import { z } from "zod";

import { WEB_API_ROUTE_BASES } from "@/constants/api";
import {
	StudentCreateRequestSchema,
	StudentResponseSchema,
	StudentUpdateRequestSchema,
} from "@/schemas/api";
import type {
	StudentCreateRequest,
	StudentResponse,
	StudentUpdateRequest,
} from "@/types/api";
import { qs } from "@/utils/api";
import { webFetch, webVoid } from "@/utils/web-api";

const BASE = WEB_API_ROUTE_BASES.academic.students;

export async function get(id: string): Promise<StudentResponse> {
	return webFetch(`${BASE}/${id}`, StudentResponseSchema);
}

export async function getByCpf(cpf: string): Promise<StudentResponse> {
	return webFetch(`${BASE}${qs({ cpf })}`, StudentResponseSchema);
}

export async function getByEmail(email: string): Promise<StudentResponse> {
	return webFetch(`${BASE}${qs({ email })}`, StudentResponseSchema);
}

export async function getByRegistration(
	registration: string,
): Promise<StudentResponse> {
	return webFetch(`${BASE}${qs({ registration })}`, StudentResponseSchema);
}

export async function getMe(): Promise<StudentResponse> {
	return webFetch(`${BASE}/me`, StudentResponseSchema);
}

export async function list(
	q?: string,
	courseId?: string,
): Promise<StudentResponse[]> {
	const params = new URLSearchParams();
	if (q) params.set("q", q);
	if (courseId) params.set("courseId", courseId);
	const search = params.toString();
	return webFetch(
		`${BASE}${search ? `?${search}` : ""}`,
		z.array(StudentResponseSchema),
	);
}

export async function create(
	body: StudentCreateRequest,
): Promise<StudentResponse> {
	return webFetch(`${BASE}`, StudentResponseSchema, {
		method: "POST",
		body: JSON.stringify(StudentCreateRequestSchema.parse(body)),
	});
}

export async function createBulk(
	body: StudentCreateRequest[],
): Promise<StudentResponse[]> {
	return webFetch(`${BASE}/bulk`, z.array(StudentResponseSchema), {
		method: "POST",
		body: JSON.stringify(z.array(StudentCreateRequestSchema).parse(body)),
	});
}

export async function update(
	id: string,
	body: StudentUpdateRequest,
): Promise<StudentResponse> {
	return webFetch(`${BASE}/${id}`, StudentResponseSchema, {
		method: "PUT",
		body: JSON.stringify(StudentUpdateRequestSchema.parse(body)),
	});
}

export async function setActive(id: string, active: boolean): Promise<void> {
	return webVoid(`${BASE}/${id}`, {
		method: "PATCH",
		body: JSON.stringify({ active }),
	});
}

export async function deactivate(id: string): Promise<void> {
	return setActive(id, false);
}

export async function reactivate(id: string): Promise<void> {
	return setActive(id, true);
}

export async function remove(id: string): Promise<void> {
	return webVoid(`${BASE}/${id}`, { method: "DELETE" });
}
