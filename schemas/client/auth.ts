import { TokenResponseSchema, createApiSuccessEnvelopeSchema } from "@/schemas";

export { createLoginFormSchema } from "./features/auth/login";

export const RefreshSessionEnvelopeSchema =
	createApiSuccessEnvelopeSchema(TokenResponseSchema);
