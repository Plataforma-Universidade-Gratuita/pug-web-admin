"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	Button,
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
	AuditInfoFilter,
	NumberFieldFilter,
	ReadOnlyPageHeader,
	ReadOnlyTableSection,
	TextFieldFilter,
} from "@/features/shared/read-only";
import type { UserResponse } from "@/types/api";
import { WebApiError } from "@/utils/web-api";

import { useUserDetailQuery, useUsersQuery } from "./queries";
import {
	createUserColumns,
	filterUsers,
	getUserDetailErrorToastContent,
	getUserEmptyStateCopy,
	getUsersListErrorToastContent,
	type UserAuditDateField,
} from "./utils";

export function UserPage() {
	const { t } = useTranslation();
	const [nameSearch, setNameSearch] = useState("");
	const [cpfSearch, setCpfSearch] = useState("");
	const [dateField, setDateField] = useState<UserAuditDateField>("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [dateFiltersOpen, setDateFiltersOpen] = useState(false);
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
	const deferredNameSearch = useDeferredValue(nameSearch.trim());
	const deferredCpfSearch = useDeferredValue(cpfSearch.trim());
	const usersQuery = useUsersQuery();
	const userDetailQuery = useUserDetailQuery(selectedUserId);
	const listErrorToastAtRef = useRef(0);
	const detailErrorToastAtRef = useRef(0);

	const allUsers = useMemo(() => usersQuery.data ?? [], [usersQuery.data]);
	const filteredUsers = useMemo(
		() =>
			filterUsers(allUsers, {
				cpfQuery: deferredCpfSearch,
				dateField,
				endDate,
				nameQuery: deferredNameSearch,
				startDate,
			}),
		[
			allUsers,
			dateField,
			deferredCpfSearch,
			deferredNameSearch,
			endDate,
			startDate,
		],
	);
	const selectedUser = userDetailQuery.data;
	const columns = useMemo(() => createUserColumns(t), [t]);
	const hasActiveDateFilters = Boolean(dateField || startDate || endDate);
	const hasAnyFilters = Boolean(
		nameSearch.trim() || cpfSearch.trim() || hasActiveDateFilters,
	);
	const emptyStateCopy = useMemo(
		() =>
			getUserEmptyStateCopy(
				t,
				deferredNameSearch || deferredCpfSearch || startDate || endDate,
			),
		[t, deferredCpfSearch, deferredNameSearch, endDate, startDate],
	);
	const tableEmptyState = useMemo(() => {
		if (usersQuery.isError) {
			return (
				<SomeErrorState
					title={t("identity.userPage.table.error.title")}
					description={t("identity.userPage.table.error.description")}
					onRefresh={() => {
						void usersQuery.refetch();
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
	}, [emptyStateCopy, t, usersQuery]);

	useEffect(() => {
		if (!usersQuery.isError || usersQuery.errorUpdatedAt === 0) {
			return;
		}

		if (listErrorToastAtRef.current === usersQuery.errorUpdatedAt) {
			return;
		}

		listErrorToastAtRef.current = usersQuery.errorUpdatedAt;
		const { title, description } = getUsersListErrorToastContent(
			t,
			usersQuery.error,
		);

		toast.danger(title, { description });
	}, [t, usersQuery.error, usersQuery.errorUpdatedAt, usersQuery.isError]);

	useEffect(() => {
		if (!userDetailQuery.isError || userDetailQuery.errorUpdatedAt === 0) {
			return;
		}

		if (detailErrorToastAtRef.current === userDetailQuery.errorUpdatedAt) {
			return;
		}

		detailErrorToastAtRef.current = userDetailQuery.errorUpdatedAt;
		const { title, description } = getUserDetailErrorToastContent(
			t,
			userDetailQuery.error,
		);

		toast.danger(title, { description });
	}, [
		t,
		userDetailQuery.error,
		userDetailQuery.errorUpdatedAt,
		userDetailQuery.isError,
	]);

	function clearFilters() {
		setNameSearch("");
		setCpfSearch("");
		setDateField("");
		setStartDate("");
		setEndDate("");
	}

	return (
		<PageShell
			width="wide"
			className="grid h-[calc(100dvh-4.5rem)] min-h-[48rem] grid-rows-[auto_minmax(0,1fr)] gap-4 overflow-hidden p-4 lg:p-6"
		>
			<ReadOnlyPageHeader
				title={t("identity.userPage.title")}
				description={t("identity.userPage.description")}
				metadata={{
					triggerLabel: t("identity.userPage.metadata.trigger"),
					emptyTitle: t("identity.userPage.metadata.empty.title"),
					emptyDescription: t("identity.userPage.metadata.empty.description"),
				}}
				actions={
					hasAnyFilters ? (
						<Button
							variant="secondary"
							onClick={clearFilters}
						>
							{t("identity.userPage.filters.clear")}
						</Button>
					) : undefined
				}
				filtersClassName="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(16rem,1fr)_auto]"
			>
				<TextFieldFilter
					label={t("identity.userPage.filters.name.label")}
					value={nameSearch}
					onChange={setNameSearch}
					placeholder={t("identity.userPage.filters.name.placeholder")}
				/>
				<NumberFieldFilter
					label={t("identity.userPage.filters.cpf.label")}
					value={cpfSearch}
					onChange={setCpfSearch}
					placeholder={t("identity.userPage.filters.cpf.placeholder")}
				/>
				<AuditInfoFilter
					label={t("identity.userPage.filters.advanced.label")}
					triggerLabel={t("identity.userPage.filters.advanced.trigger")}
					activeLabel={t("identity.userPage.filters.advanced.active")}
					open={dateFiltersOpen}
					onOpenChange={setDateFiltersOpen}
					dateFieldLabel={t("identity.userPage.filters.dateField.label")}
					dateFieldPlaceholder={t(
						"identity.userPage.filters.dateField.placeholder",
					)}
					dateField={dateField}
					onDateFieldChange={value => setDateField(value as UserAuditDateField)}
					dateFieldOptions={[
						{
							value: "createdAt",
							label: t("identity.userPage.filters.dateField.options.createdAt"),
						},
						{
							value: "updatedAt",
							label: t("identity.userPage.filters.dateField.options.updatedAt"),
						},
					]}
					startDateLabel={t("identity.userPage.filters.startDate.label")}
					startDatePlaceholder={t(
						"identity.userPage.filters.startDate.placeholder",
					)}
					startDate={startDate}
					onStartDateChange={setStartDate}
					endDateLabel={t("identity.userPage.filters.endDate.label")}
					endDatePlaceholder={t(
						"identity.userPage.filters.endDate.placeholder",
					)}
					endDate={endDate}
					onEndDateChange={setEndDate}
				/>
			</ReadOnlyPageHeader>

			<ReadOnlyTableSection<UserResponse>
				tableProps={{
					className: "h-full",
					columns,
					data: filteredUsers,
					emptyState: tableEmptyState,
					getRowActions: row => (
						<DropdownMenuInfoItem
							icon={Info}
							label={t("identity.userPage.table.actions.viewDetails")}
							onClick={() => setSelectedUserId(row.id)}
						/>
					),
					isLoading: usersQuery.isLoading,
					loadingLabel: t("identity.userPage.loading.list"),
				}}
			/>

			<Dialog
				open={selectedUserId !== null}
				onOpenChange={open => {
					if (!open) {
						setSelectedUserId(null);
					}
				}}
				isLoading={userDetailQuery.isLoading}
				loadingLabel={t("identity.userPage.loading.detail")}
			>
				<DialogContent>
					<DialogHeader overhead={t("identity.userPage.dialog.overhead")}>
						<DialogTitle>
							{selectedUser?.name ??
								t("identity.userPage.dialog.titleFallback")}
						</DialogTitle>
					</DialogHeader>
					<DialogBody className="grid justify-items-start gap-4">
						{userDetailQuery.isError ? (
							userDetailQuery.error instanceof WebApiError &&
							userDetailQuery.error.status === 404 ? (
								<NotFoundState
									title={t("identity.userPage.dialog.notFound.title")}
									description={t(
										"identity.userPage.dialog.notFound.description",
									)}
								/>
							) : (
								<SomeErrorState
									title={t("identity.userPage.dialog.error.title")}
									description={t("identity.userPage.dialog.error.description")}
									onRefresh={() => {
										void userDetailQuery.refetch();
									}}
								/>
							)
						) : selectedUser ? (
							<div className="grid gap-4">
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("identity.userPage.dialog.fields.id")}
									</p>
									<p className="ty-sm-semibold">{selectedUser.id}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("identity.userPage.dialog.fields.name")}
									</p>
									<p className="ty-sm-semibold">{selectedUser.name}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("identity.userPage.dialog.fields.cpf")}
									</p>
									<p className="ty-sm-semibold">{selectedUser.cpfFormatted}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("identity.userPage.dialog.fields.createdAt")}
									</p>
									<p className="ty-sm-semibold">
										{selectedUser.auditInfo.createdAtFormatted}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("identity.userPage.dialog.fields.updatedAt")}
									</p>
									<p className="ty-sm-semibold">
										{selectedUser.auditInfo.updatedAtFormatted}
									</p>
								</div>
							</div>
						) : (
							<NotFoundState
								title={t("identity.userPage.dialog.notFound.title")}
							/>
						)}
					</DialogBody>
				</DialogContent>
			</Dialog>
		</PageShell>
	);
}
