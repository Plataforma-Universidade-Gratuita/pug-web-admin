import { z } from "zod";

import {
	ProjectCreateRequestSchema,
	ProjectResponseSchema,
	ProjectSchoolRequestSchema,
	ProjectStatusEnum,
	ProjectUpdateRequestSchema,
} from "@/schemas/api";

// ─── Enums ───────────────────────────────────────────────────────────────────

export type ProjectStatus = z.infer<typeof ProjectStatusEnum>;

// ─── Responses ───────────────────────────────────────────────────────────────

export type ProjectResponse = z.infer<typeof ProjectResponseSchema>;

// ─── Requests ────────────────────────────────────────────────────────────────

export type ProjectCreateRequest = z.infer<typeof ProjectCreateRequestSchema>;
export type ProjectUpdateRequest = z.infer<typeof ProjectUpdateRequestSchema>;
export type ProjectSchoolRequest = z.infer<typeof ProjectSchoolRequestSchema>;
