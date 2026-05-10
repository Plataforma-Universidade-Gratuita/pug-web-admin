"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Info } from "lucide-react";

import { get as getCity, list as listCities } from "@/api/web/geo/cities";
import {
	Button,
	Dialog,
	DialogBody,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DropdownMenuInfoItem,
	EmptyState,
	Input,
	PageShell,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Section,
	SectionActions,
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
	detail: (id: string) => [...cityQueryKeys.all, "detail", id] as const,
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
	const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
	const deferredSearch = useDeferredValue(search.trim());

	const citiesQuery = useQuery({
		queryKey: cityQueryKeys.list(deferredSearch),
		queryFn: () => listCities(deferredSearch || undefined),
	});
	const cityDetailQuery = useQuery({
		queryKey:
			selectedCityId === null
				? [...cityQueryKeys.all, "detail", "idle"]
				: cityQueryKeys.detail(selectedCityId),
		queryFn: () => getCity(selectedCityId!),
		enabled: selectedCityId !== null,
	});

	const cities = citiesQuery.data ?? [];
	const selectedCity = cityDetailQuery.data;

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
				<SectionHeader>
					<div className="grid gap-2">
						<SectionTitle className="text-3xl">Cities</SectionTitle>
						<SectionDescription className="max-w-none">
							Read-only geographic directory used across academic, identity,
							partner, and project flows.
						</SectionDescription>
					</div>
					<SectionActions>
						<Popover>
							<PopoverTrigger>
								<Button
									aria-label="Open cities metadata"
									size="icon"
									tooltipContent="Metadata"
									variant="secondary"
								>
									<Info className="h-4 w-4" />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-80">
								<EmptyState
									title="Metadata coming soon"
									description="Service provenance, freshness, and request metadata will live here."
								/>
							</PopoverContent>
						</Popover>
					</SectionActions>
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
							getRowActions={row => (
								<DropdownMenuInfoItem
									icon={Info}
									label="View city details"
									onClick={() => setSelectedCityId(row.id)}
								/>
							)}
							isLoading={citiesQuery.isLoading}
							loadingLabel="Loading city catalog"
						/>
					</SectionContent>
				</Section>
			</div>

			<Dialog
				open={selectedCityId !== null}
				onOpenChange={open => {
					if (!open) {
						setSelectedCityId(null);
					}
				}}
				isLoading={cityDetailQuery.isLoading}
				loadingLabel="Loading city details"
			>
				<DialogContent>
					<DialogHeader overhead="City record">
						<DialogTitle>{selectedCity?.name ?? "City details"}</DialogTitle>
					</DialogHeader>
					<DialogBody className="grid gap-4">
						{cityDetailQuery.isError ? (
							<EmptyState
								title="Unable to load city"
								description="The city record could not be loaded right now."
							/>
						) : selectedCity ? (
							<div className="grid gap-4">
								<div className="grid gap-1">
									<p className="ty-helper">Identifier</p>
									<p className="ty-sm-semibold">{selectedCity.id}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">City name</p>
									<p className="ty-sm-semibold">{selectedCity.name}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">IBGE code</p>
									<p className="ty-sm-semibold">{selectedCity.ibgeCode}</p>
								</div>
							</div>
						) : null}
					</DialogBody>
				</DialogContent>
			</Dialog>
		</PageShell>
	);
}
