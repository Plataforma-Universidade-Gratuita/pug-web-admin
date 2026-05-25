import {
	TokenResponseSchema,
	createApiSuccessEnvelopeSchema,
} from "@/schemas/api";

export { createLoginFormSchema } from "./features/auth/login";

export const RefreshSessionEnvelopeSchema =
	createApiSuccessEnvelopeSchema(TokenResponseSchema);
