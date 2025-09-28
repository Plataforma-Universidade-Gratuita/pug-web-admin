"use client";

import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { zfetch } from "../../utils/api";

const Health = z.object({ ok: z.boolean() });

export default function Demo() {
	const q = useQuery({
		queryKey: ["health"],
		queryFn: () => zfetch("/api/health", {}, Health),
	});
	if (q.isLoading) return <p className="p-6">Carregando…</p>;
	if (q.error) return <p className="p-6 text-red-600">Erro</p>;
	return <pre className="p-6">{JSON.stringify(q.data, null, 2)}</pre>;
}
