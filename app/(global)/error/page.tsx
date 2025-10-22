"use client";
export default function Error({ error }: { error: Error }) {
	return <pre className="p-6 text-red-600">{error.message}</pre>;
}
