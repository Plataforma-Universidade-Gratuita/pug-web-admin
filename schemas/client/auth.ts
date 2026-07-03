/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import {
	TokenResponseSchema,
	createApiSuccessEnvelopeSchema,
} from "@/schemas/api";

export { createLoginFormSchema } from "./features/auth/login";

export const RefreshSessionEnvelopeSchema =
	createApiSuccessEnvelopeSchema(TokenResponseSchema);
