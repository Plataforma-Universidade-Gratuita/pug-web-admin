import { z } from "zod";

import {
	TokenResponseSchema,
	createApiSuccessEnvelopeSchema,
} from "@/schemas/api";

export const LoginFormSchema = z.object({
	email: z.email("Enter a valid email address."),
	password: z.string().min(1, "Enter your password."),
});

export const RefreshSessionEnvelopeSchema =
	createApiSuccessEnvelopeSchema(TokenResponseSchema);
