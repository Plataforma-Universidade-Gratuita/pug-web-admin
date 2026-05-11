"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

import { Eye, Filter } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	Badge,
	Button,
	Dialog,
	DialogBody,
	DialogContent,
	DialogHeader,
	DialogTitle,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DropdownMenuInfoItem,
	Label,
	NoContentState,
	NotFoundState,
	PageShell,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SomeErrorState,
	toast,
} from "@/components";
import {
	AuditInfoFilterFields,
	ReadOnlyPageHeader,
	ReadOnlyTableSection,
	TextFieldFilter,
} from "@/features/shared/read-only";
import type { AccountResponse } from "@/types/api";
import { WebApiError } from "@/utils/web-api";

import {
	useAccountDetailQuery,
	useAccountsQuery,
	useLinkedUserQuery,
} from "./queries";
import {
	createAccountColumns,
	filterAccounts,
	getAccountDetailErrorToastContent,
	getAccountEmptyStateCopy,
	getAccountFilterSummary,
	getAccountOptionClassName,
	getAccountsListErrorToastContent,
	getAccountTypeTone,
	getLinkedUserErrorToastContent,
	type AccountActiveFilter,
	type AccountAuditDateField,
	type AccountTypeFilter,
} from "./utils";

export function AccountPage() {
	const { t } = useTranslation();
	const [querySearch, setQuerySearch] = useState("");
	const [filtersOpen, setFiltersOpen] = useState(false);
	const [draftActiveFilter, setDraftActiveFilter] =
		useState<AccountActiveFilter>("");
	const [draftAccountTypeFilter, setDraftAccountTypeFilter] =
		useState<AccountTypeFilter>("");
	const [draftDateField, setDraftDateField] =
		useState<AccountAuditDateField>("");
	const [draftStartDate, setDraftStartDate] = useState("");
	const [draftEndDate, setDraftEndDate] = useState("");
	const [activeFilter, setActiveFilter] = useState<AccountActiveFilter>("");
	const [accountTypeFilter, setAccountTypeFilter] =
		useState<AccountTypeFilter>("");
	const [dateField, setDateField] = useState<AccountAuditDateField>("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
		null,
	);
	const deferredQuerySearch = useDeferredValue(querySearch.trim());
	const accountsQuery = useAccountsQuery();
	const accountDetailQuery = useAccountDetailQuery(selectedAccountId);
	const linkedUserQuery = useLinkedUserQuery(
		accountDetailQuery.data?.userId ?? null,
	);
	const listErrorToastAtRef = useRef(0);
	const detailErrorToastAtRef = useRef(0);
	const linkedUserErrorToastAtRef = useRef(0);

	const allAccounts = useMemo(
		() => accountsQuery.data ?? [],
		[accountsQuery.data],
	);
	const filteredAccounts = useMemo(
		() =>
			filterAccounts(allAccounts, {
				activeFilter,
				accountTypeFilter,
				dateField,
				query: deferredQuerySearch,
				endDate,
				startDate,
			}),
		[
			accountTypeFilter,
			activeFilter,
			allAccounts,
			dateField,
			deferredQuerySearch,
			endDate,
			startDate,
		],
	);
	const columns = useMemo(() => createAccountColumns(t), [t]);
	const selectedAccount = accountDetailQuery.data;
	const hasSecondaryFilters = Boolean(
		activeFilter || accountTypeFilter || dateField || startDate || endDate,
	);
	const hasAnyFilters = Boolean(querySearch.trim() || hasSecondaryFilters);
	const filterSummary = useMemo(
		() =>
			getAccountFilterSummary(t, {
				activeFilter,
				accountTypeFilter,
				dateField,
				query: deferredQuerySearch,
				endDate,
				startDate,
			}),
		[
			accountTypeFilter,
			activeFilter,
			dateField,
			deferredQuerySearch,
			endDate,
			startDate,
			t,
		],
	);
	const emptyStateCopy = useMemo(
		() => getAccountEmptyStateCopy(t, filterSummary),
		[filterSummary, t],
	);
	const tableEmptyState = useMemo(() => {
		if (accountsQuery.isError) {
			return (
				<SomeErrorState
					title={t("identity.accountPage.table.error.title")}
					description={t("identity.accountPage.table.error.description")}
					onRefresh={() => {
						void accountsQuery.refetch();
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
	}, [accountsQuery, emptyStateCopy.description, emptyStateCopy.title, t]);

	useEffect(() => {
		if (!accountsQuery.isError || accountsQuery.errorUpdatedAt === 0) {
			return;
		}

		if (listErrorToastAtRef.current === accountsQuery.errorUpdatedAt) {
			return;
		}

		listErrorToastAtRef.current = accountsQuery.errorUpdatedAt;
		const { title, description } = getAccountsListErrorToastContent(
			t,
			accountsQuery.error,
		);
		toast.danger(title, { description });
	}, [
		accountsQuery.error,
		accountsQuery.errorUpdatedAt,
		accountsQuery.isError,
		t,
	]);

	useEffect(() => {
		if (
			!accountDetailQuery.isError ||
			accountDetailQuery.errorUpdatedAt === 0
		) {
			return;
		}

		if (detailErrorToastAtRef.current === accountDetailQuery.errorUpdatedAt) {
			return;
		}

		detailErrorToastAtRef.current = accountDetailQuery.errorUpdatedAt;
		const { title, description } = getAccountDetailErrorToastContent(
			t,
			accountDetailQuery.error,
		);
		toast.danger(title, { description });
	}, [
		accountDetailQuery.error,
		accountDetailQuery.errorUpdatedAt,
		accountDetailQuery.isError,
		t,
	]);

	useEffect(() => {
		if (!linkedUserQuery.isError || linkedUserQuery.errorUpdatedAt === 0) {
			return;
		}

		if (linkedUserErrorToastAtRef.current === linkedUserQuery.errorUpdatedAt) {
			return;
		}

		linkedUserErrorToastAtRef.current = linkedUserQuery.errorUpdatedAt;
		const { title, description } = getLinkedUserErrorToastContent(
			t,
			linkedUserQuery.error,
		);
		toast.danger(title, { description });
	}, [
		linkedUserQuery.error,
		linkedUserQuery.errorUpdatedAt,
		linkedUserQuery.isError,
		t,
	]);

	function applySecondaryFilters() {
		setActiveFilter(draftActiveFilter);
		setAccountTypeFilter(draftAccountTypeFilter);
		setDateField(draftDateField);
		setStartDate(draftStartDate);
		setEndDate(draftEndDate);
		setFiltersOpen(false);
	}

	function clearAllFilters() {
		setQuerySearch("");
		setDraftActiveFilter("");
		setDraftAccountTypeFilter("");
		setDraftDateField("");
		setDraftStartDate("");
		setDraftEndDate("");
		setActiveFilter("");
		setAccountTypeFilter("");
		setDateField("");
		setStartDate("");
		setEndDate("");
		setFiltersOpen(false);
	}

	return (
		<PageShell
			width="wide"
			className="grid h-[calc(100dvh-4.5rem)] min-h-[48rem] grid-rows-[auto_minmax(0,1fr)] gap-4 overflow-hidden p-4 lg:p-6"
		>
			<ReadOnlyPageHeader
				title={t("identity.accountPage.title")}
				description={t("identity.accountPage.description")}
				metadata={{
					triggerLabel: t("identity.accountPage.metadata.trigger"),
					emptyTitle: t("identity.accountPage.metadata.empty.title"),
					emptyDescription: t(
						"identity.accountPage.metadata.empty.description",
					),
				}}
				actions={
					hasAnyFilters ? (
						<Button
							variant="secondary"
							onClick={clearAllFilters}
						>
							{t("identity.accountPage.filters.clear")}
						</Button>
					) : undefined
				}
				filtersClassName="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_auto]"
			>
				<TextFieldFilter
					label={t("identity.accountPage.filters.email.label")}
					value={querySearch}
					onChange={setQuerySearch}
					placeholder={t("identity.accountPage.filters.email.placeholder")}
				/>

				<Drawer
					open={filtersOpen}
					onOpenChange={setFiltersOpen}
				>
					<div className="grid gap-2 self-end">
						<Label>{t("identity.accountPage.filters.drawer.label")}</Label>
						<Button
							variant="secondary"
							usage={hasSecondaryFilters ? "info" : "secondary"}
							className="w-full justify-start lg:min-w-56"
							onClick={() => setFiltersOpen(true)}
						>
							{hasSecondaryFilters
								? t("identity.accountPage.filters.drawer.active")
								: t("identity.accountPage.filters.drawer.trigger")}
						</Button>
					</div>
					<DrawerContent>
						<DrawerHeader
							overhead={t("identity.accountPage.filters.drawer.overhead")}
						>
							<DrawerTitle>
								{t("identity.accountPage.filters.drawer.title")}
							</DrawerTitle>
						</DrawerHeader>
						<DrawerBody className="grid gap-6">
							<div className="grid gap-2">
								<Label>{t("identity.accountPage.filters.active.label")}</Label>
								<Select
									value={draftActiveFilter}
									onValueChange={value =>
										setDraftActiveFilter(
											value === "ALL" ? "" : (value as AccountActiveFilter),
										)
									}
								>
									<SelectTrigger
										className="w-full"
										placeholder={t(
											"identity.accountPage.filters.active.placeholder",
										)}
									/>
									<SelectContent>
										<SelectItem value="ALL">
											{t("identity.accountPage.filters.active.options.all")}
										</SelectItem>
										<SelectItem
											value="true"
											className={getAccountOptionClassName("active", "true")}
										>
											{t("identity.accountPage.filters.active.options.active")}
										</SelectItem>
										<SelectItem
											value="false"
											className={getAccountOptionClassName("active", "false")}
										>
											{t(
												"identity.accountPage.filters.active.options.inactive",
											)}
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="grid gap-2">
								<Label>
									{t("identity.accountPage.filters.accountType.label")}
								</Label>
								<Select
									value={draftAccountTypeFilter}
									onValueChange={value =>
										setDraftAccountTypeFilter(
											value === "ALL" ? "" : (value as AccountTypeFilter),
										)
									}
								>
									<SelectTrigger
										className="w-full"
										placeholder={t(
											"identity.accountPage.filters.accountType.placeholder",
										)}
									/>
									<SelectContent>
										<SelectItem value="ALL">
											{t(
												"identity.accountPage.filters.accountType.options.all",
											)}
										</SelectItem>
										<SelectItem
											value="ADMIN"
											className={getAccountOptionClassName(
												"accountType",
												"ADMIN",
											)}
										>
											{t(
												"identity.accountPage.filters.accountType.options.ADMIN",
											)}
										</SelectItem>
										<SelectItem
											value="PARTNER"
											className={getAccountOptionClassName(
												"accountType",
												"PARTNER",
											)}
										>
											{t(
												"identity.accountPage.filters.accountType.options.PARTNER",
											)}
										</SelectItem>
										<SelectItem
											value="STUDENT"
											className={getAccountOptionClassName(
												"accountType",
												"STUDENT",
											)}
										>
											{t(
												"identity.accountPage.filters.accountType.options.STUDENT",
											)}
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<AuditInfoFilterFields
								dateFieldLabel={t(
									"identity.accountPage.filters.dateField.label",
								)}
								dateFieldPlaceholder={t(
									"identity.accountPage.filters.dateField.placeholder",
								)}
								dateField={draftDateField}
								onDateFieldChange={value =>
									setDraftDateField(value as AccountAuditDateField)
								}
								dateFieldOptions={[
									{
										value: "createdAt",
										label: t(
											"identity.accountPage.filters.dateField.options.createdAt",
										),
									},
									{
										value: "updatedAt",
										label: t(
											"identity.accountPage.filters.dateField.options.updatedAt",
										),
									},
								]}
								startDateLabel={t(
									"identity.accountPage.filters.startDate.label",
								)}
								startDatePlaceholder={t(
									"identity.accountPage.filters.startDate.placeholder",
								)}
								startDate={draftStartDate}
								onStartDateChange={setDraftStartDate}
								endDateLabel={t("identity.accountPage.filters.endDate.label")}
								endDatePlaceholder={t(
									"identity.accountPage.filters.endDate.placeholder",
								)}
								endDate={draftEndDate}
								onEndDateChange={setDraftEndDate}
							/>
						</DrawerBody>
						<DrawerFooter
							clearConfirmTitle={t(
								"identity.accountPage.filters.drawer.clearConfirm.title",
							)}
							clearConfirmDescription={t(
								"identity.accountPage.filters.drawer.clearConfirm.description",
							)}
							clearLabel={t("identity.accountPage.filters.clear")}
							actionLabel={t("identity.accountPage.filters.drawer.apply")}
							actionIcon={Filter}
							onClear={clearAllFilters}
							onAction={applySecondaryFilters}
						/>
					</DrawerContent>
				</Drawer>
			</ReadOnlyPageHeader>

			<ReadOnlyTableSection<AccountResponse>
				tableProps={{
					className: "h-full",
					columns,
					data: filteredAccounts,
					emptyState: tableEmptyState,
					getRowActions: row => (
						<DropdownMenuInfoItem
							icon={Eye}
							label={t("identity.accountPage.table.actions.viewDetails")}
							onClick={() => setSelectedAccountId(row.id)}
						/>
					),
					isLoading: accountsQuery.isLoading,
					loadingLabel: t("identity.accountPage.loading.list"),
				}}
			/>

			<Dialog
				open={selectedAccountId !== null}
				onOpenChange={open => {
					if (!open) {
						setSelectedAccountId(null);
					}
				}}
				isLoading={accountDetailQuery.isLoading}
				loadingLabel={t("identity.accountPage.loading.detail")}
			>
				<DialogContent>
					<DialogHeader overhead={t("identity.accountPage.dialog.overhead")}>
						<DialogTitle>
							{selectedAccount?.email ??
								t("identity.accountPage.dialog.titleFallback")}
						</DialogTitle>
					</DialogHeader>
					<DialogBody className="grid justify-items-start gap-6">
						{accountDetailQuery.isError ? (
							accountDetailQuery.error instanceof WebApiError &&
							accountDetailQuery.error.status === 404 ? (
								<NotFoundState
									title={t("identity.accountPage.dialog.notFound.title")}
									description={t(
										"identity.accountPage.dialog.notFound.description",
									)}
								/>
							) : (
								<SomeErrorState
									title={t("identity.accountPage.dialog.error.title")}
									description={t(
										"identity.accountPage.dialog.error.description",
									)}
									onRefresh={() => {
										void accountDetailQuery.refetch();
									}}
								/>
							)
						) : selectedAccount ? (
							<div className="grid w-full gap-6 lg:grid-cols-2 lg:gap-8">
								<div className="grid gap-4">
									<div className="grid gap-1">
										<p className="ty-helper">
											{t("identity.accountPage.dialog.fields.id")}
										</p>
										<p className="ty-sm-semibold">{selectedAccount.id}</p>
									</div>
									<div className="grid gap-1">
										<p className="ty-helper">
											{t("identity.accountPage.dialog.fields.email")}
										</p>
										<p className="ty-sm-semibold">{selectedAccount.email}</p>
									</div>
									<div className="grid gap-1">
										<p className="ty-helper">
											{t("identity.accountPage.dialog.fields.accountType")}
										</p>
										<div>
											<Badge
												className="min-h-5 px-2 py-0.5"
												tone={getAccountTypeTone(selectedAccount.accountType)}
												variant="primary"
											>
												{selectedAccount.accountTypeFormatted}
											</Badge>
										</div>
									</div>
									<div className="grid gap-1">
										<p className="ty-helper">
											{t("identity.accountPage.dialog.fields.active")}
										</p>
										<div>
											<Badge
												className="min-h-5 px-2 py-0.5"
												tone={selectedAccount.active ? "success" : "danger"}
												variant="primary"
											>
												{selectedAccount.active
													? t("identity.accountPage.dialog.active.yes")
													: t("identity.accountPage.dialog.active.no")}
											</Badge>
										</div>
									</div>
									<div className="grid gap-1">
										<p className="ty-helper">
											{t("identity.accountPage.dialog.fields.createdAt")}
										</p>
										<p className="ty-sm-semibold">
											{selectedAccount.auditInfo.createdAtFormatted}
										</p>
									</div>
									<div className="grid gap-1">
										<p className="ty-helper">
											{t("identity.accountPage.dialog.fields.updatedAt")}
										</p>
										<p className="ty-sm-semibold">
											{selectedAccount.auditInfo.updatedAtFormatted}
										</p>
									</div>
								</div>

								<div className="grid w-full content-start gap-3">
									<p className="ty-overhead">
										{t("identity.accountPage.dialog.linkedUser.overhead")}
									</p>
									{linkedUserQuery.isLoading ? (
										<p className="ty-sm text-[color:var(--twc-muted)]">
											{t("identity.accountPage.dialog.linkedUser.loading")}
										</p>
									) : linkedUserQuery.isError ? (
										linkedUserQuery.error instanceof WebApiError &&
										linkedUserQuery.error.status === 404 ? (
											<NotFoundState
												title={t(
													"identity.accountPage.dialog.linkedUser.notFound.title",
												)}
												description={t(
													"identity.accountPage.dialog.linkedUser.notFound.description",
												)}
											/>
										) : (
											<SomeErrorState
												title={t(
													"identity.accountPage.dialog.linkedUser.error.title",
												)}
												description={t(
													"identity.accountPage.dialog.linkedUser.error.description",
												)}
												onRefresh={() => {
													void linkedUserQuery.refetch();
												}}
											/>
										)
									) : linkedUserQuery.data ? (
										<div className="grid gap-4">
											<div className="grid gap-1">
												<p className="ty-helper">
													{t(
														"identity.accountPage.dialog.linkedUser.fields.id",
													)}
												</p>
												<p className="ty-sm-semibold">
													{linkedUserQuery.data.id}
												</p>
											</div>
											<div className="grid gap-1">
												<p className="ty-helper">
													{t(
														"identity.accountPage.dialog.linkedUser.fields.name",
													)}
												</p>
												<p className="ty-sm-semibold">
													{linkedUserQuery.data.name}
												</p>
											</div>
											<div className="grid gap-1">
												<p className="ty-helper">
													{t(
														"identity.accountPage.dialog.linkedUser.fields.cpf",
													)}
												</p>
												<p className="ty-sm-semibold">
													{linkedUserQuery.data.cpfFormatted}
												</p>
											</div>
										</div>
									) : (
										<NotFoundState
											title={t(
												"identity.accountPage.dialog.linkedUser.notFound.title",
											)}
										/>
									)}
								</div>
							</div>
						) : (
							<NotFoundState
								title={t("identity.accountPage.dialog.notFound.title")}
							/>
						)}
					</DialogBody>
				</DialogContent>
			</Dialog>
		</PageShell>
	);
}
