"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	Dialog,
	DialogBody,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DropdownMenuInfoItem,
	NoContentState,
	NotFoundState,
	PageShell,
	SomeErrorState,
	toast,
} from "@/components";
import {
	useCitiesQuery,
	useCityDetailQuery,
} from "@/features/geo/city/queries";
import {
	createCityColumns,
	filterCities,
	getCitiesEmptyStateCopy,
	getCitiesListErrorToastContent,
	getCityDetailErrorToastContent,
} from "@/features/geo/city/utils";
import {
	ServicePageHeader,
	ServicePageTableSection,
	TextFieldFilter,
} from "@/features/shared/service-pages";
import type { CityResponse } from "@/types/api";
import { WebApiError } from "@/utils/web-api";

export function CityPage() {
	const { t } = useTranslation();
	const [search, setSearch] = useState("");
	const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
	const deferredSearch = useDeferredValue(search.trim());
	const citiesQuery = useCitiesQuery();
	const cityDetailQuery = useCityDetailQuery(selectedCityId);
	const listErrorToastAtRef = useRef(0);
	const detailErrorToastAtRef = useRef(0);

	const allCities = useMemo(() => citiesQuery.data ?? [], [citiesQuery.data]);
	const filteredCities = useMemo(
		() => filterCities(allCities, deferredSearch),
		[allCities, deferredSearch],
	);
	const selectedCity = cityDetailQuery.data;
	const columns = useMemo(() => createCityColumns(t), [t]);
	const emptyStateCopy = useMemo(
		() => getCitiesEmptyStateCopy(t, deferredSearch),
		[t, deferredSearch],
	);
	const tableEmptyState = useMemo(() => {
		if (citiesQuery.isError) {
			return (
				<SomeErrorState
					title={t("geo.cityPage.table.error.title")}
					description={t("geo.cityPage.table.error.description")}
					onRefresh={() => {
						void citiesQuery.refetch();
					}}
				/>
			);
		}

		return (
			<NoContentState
				title={emptyStateCopy.title}
				description={emptyStateCopy.description}
			/>
		);
	}, [citiesQuery, emptyStateCopy, t]);

	useEffect(() => {
		if (!citiesQuery.isError || citiesQuery.errorUpdatedAt === 0) {
			return;
		}

		if (listErrorToastAtRef.current === citiesQuery.errorUpdatedAt) {
			return;
		}

		listErrorToastAtRef.current = citiesQuery.errorUpdatedAt;
		const { title, description } = getCitiesListErrorToastContent(
			t,
			citiesQuery.error,
		);

		toast.danger(title, { description });
	}, [citiesQuery.error, citiesQuery.errorUpdatedAt, citiesQuery.isError, t]);

	useEffect(() => {
		if (!cityDetailQuery.isError || cityDetailQuery.errorUpdatedAt === 0) {
			return;
		}

		if (detailErrorToastAtRef.current === cityDetailQuery.errorUpdatedAt) {
			return;
		}

		detailErrorToastAtRef.current = cityDetailQuery.errorUpdatedAt;
		const { title, description } = getCityDetailErrorToastContent(
			t,
			cityDetailQuery.error,
		);

		toast.danger(title, { description });
	}, [
		cityDetailQuery.error,
		cityDetailQuery.errorUpdatedAt,
		cityDetailQuery.isError,
		t,
	]);

	return (
		<PageShell
			width="wide"
			className="grid h-[calc(100dvh-4.5rem)] min-h-[48rem] grid-rows-[auto_minmax(0,1fr)] gap-4 overflow-hidden p-4 lg:p-6"
		>
			<ServicePageHeader
				title={t("geo.cityPage.title")}
				description={t("geo.cityPage.description")}
				metadata={{
					triggerLabel: t("geo.cityPage.metadata.trigger"),
					emptyTitle: t("geo.cityPage.metadata.empty.title"),
					emptyDescription: t("geo.cityPage.metadata.empty.description"),
				}}
				filtersClassName="grid gap-2"
			>
				<TextFieldFilter
					value={search}
					onChange={setSearch}
					placeholder={t("geo.cityPage.filters.searchPlaceholder")}
				/>
			</ServicePageHeader>

			<ServicePageTableSection<CityResponse>
				tableProps={{
					className: "h-full",
					columns,
					data: filteredCities,
					emptyState: tableEmptyState,
					getRowActions: row => (
						<DropdownMenuInfoItem
							icon={Info}
							label={t("geo.cityPage.table.actions.viewDetails")}
							onClick={() => setSelectedCityId(row.id)}
						/>
					),
					isLoading: citiesQuery.isLoading,
					loadingLabel: t("geo.cityPage.loading.list"),
				}}
			/>

			<Dialog
				open={selectedCityId !== null}
				onOpenChange={open => {
					if (!open) {
						setSelectedCityId(null);
					}
				}}
				isLoading={cityDetailQuery.isLoading}
				loadingLabel={t("geo.cityPage.loading.detail")}
			>
				<DialogContent>
					<DialogHeader overhead={t("geo.cityPage.dialog.overhead")}>
						<DialogTitle>
							{selectedCity?.name ?? t("geo.cityPage.dialog.titleFallback")}
						</DialogTitle>
					</DialogHeader>
					<DialogBody className="grid justify-items-start gap-4">
						{cityDetailQuery.isError ? (
							cityDetailQuery.error instanceof WebApiError &&
							cityDetailQuery.error.status === 404 ? (
								<NotFoundState
									title={t("geo.cityPage.dialog.notFound.title")}
									description={t("geo.cityPage.dialog.notFound.description")}
								/>
							) : (
								<SomeErrorState
									title={t("geo.cityPage.dialog.error.title")}
									description={t("geo.cityPage.dialog.error.description")}
									onRefresh={() => {
										void cityDetailQuery.refetch();
									}}
								/>
							)
						) : selectedCity ? (
							<div className="grid gap-4">
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("geo.cityPage.dialog.fields.id")}
									</p>
									<p className="ty-sm-semibold">{selectedCity.id}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("geo.cityPage.dialog.fields.name")}
									</p>
									<p className="ty-sm-semibold">{selectedCity.name}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("geo.cityPage.dialog.fields.ibgeCode")}
									</p>
									<p className="ty-sm-semibold">{selectedCity.ibgeCode}</p>
								</div>
							</div>
						) : (
							<NotFoundState title={t("geo.cityPage.dialog.notFound.title")} />
						)}
					</DialogBody>
				</DialogContent>
			</Dialog>
		</PageShell>
	);
}
