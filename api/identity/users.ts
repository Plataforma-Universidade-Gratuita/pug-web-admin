import { z } from "zod";

import { UserResponseSchema } from "@/schemas/api/identity/account";
import { zfetch, qs } from "@/utils/api";

import type { UserResponse } from "@/types/api";

const BASE = "/identity/users";

export async function get(id: string, token: string): Promise<UserResponse> {
  return zfetch(`${BASE}/${id}`, { method: "GET" }, UserResponseSchema, token);
}

export async function getByCpf(cpf: string, token: string): Promise<UserResponse> {
  return zfetch(`${BASE}/by-cpf/${cpf}`, { method: "GET" }, UserResponseSchema, token);
}

export async function getMe(token: string): Promise<UserResponse> {
  return zfetch(`${BASE}/me`, { method: "GET" }, UserResponseSchema, token);
}

export async function list(token: string, q?: string): Promise<UserResponse[]> {
  return zfetch(`${BASE}${qs({ q })}`, { method: "GET" }, z.array(UserResponseSchema), token);
}

