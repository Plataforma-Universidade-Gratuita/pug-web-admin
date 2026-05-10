"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";

import { list as listCities } from "@/api/web/geo/cities";
import {
	EmptyState,
	Input,
	PageShell,
	Section,
	SectionContent,
	SectionDescription,
	SectionHeader,
	SectionTitle,
	Table,
} from "@/components";
import type { CityResponse } from "@/types/api";

const cityQueryKeys = {
	all: ["geo", "cities"] as const,
	list: (q: string) => [...cityQueryKeys.all, q] as const,
};

const cityColumns: ColumnDef<CityResponse>[] = [
	{
		accessorKey: "name",
		header: "City",
	},
	{
		accessorKey: "ibgeCode",
		header: "IBGE code",
	},
];

export default function Page() {
	const [search, setSearch] = useState("");
	const deferredSearch = useDeferredValue(search.trim());

	const citiesQuery = useQuery({
		queryKey: cityQueryKeys.list(deferredSearch),
		queryFn: () => listCities(deferredSearch || undefined),
	});

	const cities = citiesQuery.data ?? [];

	const tableEmptyState = useMemo(
		() => (
			<EmptyState
				title="No cities found"
				description={
					deferredSearch
						? `No seeded city matches \"${deferredSearch}\".`
						: "The city catalog is currently empty."
				}
			/>
		),
		[deferredSearch],
	);

	return (
		<PageShell
			width="wide"
			className="grid h-[calc(100dvh-6rem)] min-h-[42rem] grid-rows-[auto_minmax(0,1fr)] gap-6 overflow-hidden p-6 lg:p-8"
		>
			<Section className="shadow-normal rounded-[calc(var(--twc-radius-xl)+0.25rem)] border border-[color:var(--twc-border-2)] bg-[color:var(--twc-surface-2)] px-6 py-5">
				<SectionHeader className="gap-3 lg:grid-cols-1">
					<div className="grid gap-2">
						<SectionTitle className="text-3xl">Cities</SectionTitle>
						<SectionDescription className="max-w-none">
							Read-only geographic directory used across academic, identity,
							partner, and project flows.
						</SectionDescription>
					</div>
				</SectionHeader>
				<SectionContent className="grid gap-3">
					<Input
						type="search"
						value={search}
						onChange={event => setSearch(event.target.value)}
						placeholder="Search by city name or IBGE code"
						className="w-full"
					/>
				</SectionContent>
			</Section>

			<div className="grid h-full min-h-0">
				<Section className="shadow-normal grid h-full min-h-0 grid-rows-[minmax(0,1fr)] rounded-[calc(var(--twc-radius-xl)+0.25rem)] border border-[color:var(--twc-border-2)] bg-[color:var(--twc-surface-1)]">
					<SectionContent className="h-full min-h-0 overflow-hidden">
						<Table<CityResponse>
							className="h-full"
							columns={cityColumns}
							data={cities}
							emptyState={tableEmptyState}
							isLoading={citiesQuery.isLoading}
							loadingLabel="Loading city catalog"
						/>
					</SectionContent>
				</Section>
			</div>
		</PageShell>
	);
}
