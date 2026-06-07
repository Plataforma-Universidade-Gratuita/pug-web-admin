"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { LogOut, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";

import * as web from "@/api/web";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	Button,
	Icon,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Separator,
	Skeleton,
	toast,
} from "@/components/primitives";
import { LOGIN_ROUTE } from "@/constants";
import type { SidebarProps } from "@/types/client";
import type { LogoutScope } from "@/types/client";

const { admins: adminsApi, auth: authApi, users: usersApi } = web.identity;
const { adminKeys, useCurrentAdminQuery } = adminsApi;
const { logout, logoutAll } = authApi;
const { userKeys, useCurrentUserQuery } = usersApi;

export function AccountMenu({ collapsed }: Pick<SidebarProps, "collapsed">) {
	const queryClient = useQueryClient();
	const router = useRouter();
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [pendingScope, setPendingScope] = useState<LogoutScope | null>(null);
	const adminQuery = useCurrentAdminQuery();
	const userQuery = useCurrentUserQuery();
	const admin = adminQuery.data;
	const user = userQuery.data;
	const isProfileLoading = adminQuery.isLoading || userQuery.isLoading;
	const isProfileError = adminQuery.isError || userQuery.isError;
	const profileError = adminQuery.error ?? userQuery.error;

	async function finalizeLogout(successMessage: string) {
		await queryClient.invalidateQueries({ queryKey: adminKeys.all });
		await queryClient.invalidateQueries({ queryKey: userKeys.all });
		queryClient.clear();
		setIsLogoutDialogOpen(false);
		setOpen(false);
		toast.success(successMessage);
		router.replace(LOGIN_ROUTE);
		router.refresh();
	}

	function handleOpenLogoutDialog() {
		setOpen(false);
		setIsLogoutDialogOpen(true);
	}

	function handleLogout(scope: LogoutScope) {
		setPendingScope(scope);
		startTransition(async () => {
			try {
				if (scope === "all") {
					await logoutAll();
					await finalizeLogout(t("Navbar.account.logoutAllSuccess"));
				} else {
					await logout();
					await finalizeLogout(t("Navbar.account.logoutCurrentSuccess"));
				}
			} catch (error) {
				const message =
					error instanceof Error
						? error.message
						: t("Navbar.account.logoutError");

				toast.danger(message);
			} finally {
				setPendingScope(null);
			}
		});
	}

	function handleRetryProfile() {
		void Promise.all([adminQuery.refetch(), userQuery.refetch()]);
	}

	return (
		<>
			<Popover
				open={open}
				onOpenChange={setOpen}
			>
				<PopoverTrigger>
					<Button
						size={collapsed ? "icon" : "md"}
						usage="secondary"
						variant="secondary"
						title={t("Navbar.account.label")}
						aria-label={t("Navbar.account.label")}
						className={clsx(
							"app-sidebar-item !rounded-[calc(var(--twc-radius-xl)+0.125rem)]",
							collapsed ? "justify-center px-0" : null,
							open ? "app-sidebar-item-active" : null,
						)}
						leadingIcon={
							<Icon
								icon={UserRound}
								size={20}
								strokeWidth={2}
								className={clsx(
									"app-sidebar-item-icon",
									open ? "app-sidebar-item-icon-active" : null,
								)}
							/>
						}
					>
						{collapsed ? null : (
							<span
								className={clsx(
									"app-sidebar-item-label truncate",
									open ? "app-sidebar-item-label-active" : null,
								)}
							>
								{t("Navbar.account.label")}
							</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent
					side="right"
					align="end"
					sideOffset={12}
					collisionPadding={8}
					className="app-sidebar-account-popover"
				>
					{isProfileError ? (
						<>
							<div className="flex flex-col items-start gap-4 rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] p-4">
								<div className="space-y-1">
									<p className="ty-sm-bold">
										{t("home.currentAccount.error.title")}
									</p>
									<p className="ty-helper">
										{profileError instanceof Error
											? profileError.message
											: t("home.currentAccount.error.description")}
									</p>
								</div>
								<Button
									usage="secondary"
									variant="secondary"
									onClick={handleRetryProfile}
								>
									{t("home.currentAccount.error.retry")}
								</Button>
							</div>
							<Separator className="separator-horizontal" />
							<Button
								className="w-full justify-start"
								usage="secondary"
								variant="secondary"
								onClick={handleOpenLogoutDialog}
								leadingIcon={
									<Icon
										icon={LogOut}
										size={16}
									/>
								}
							>
								{t("Navbar.account.logout")}
							</Button>
						</>
					) : (
						<>
							<div className="app-sidebar-account-summary">
								<div className="app-sidebar-account-avatar">
									<Icon
										icon={UserRound}
										size={16}
									/>
								</div>
								<div className="app-sidebar-account-copy">
									{isProfileLoading ? (
										<>
											<Skeleton className="h-4 w-28 rounded-[var(--twc-radius-square)]" />
											<Skeleton className="h-3 w-40 rounded-[var(--twc-radius-square)]" />
											<Skeleton className="h-3 w-24 rounded-[var(--twc-radius-square)]" />
										</>
									) : (
										<>
											<p className="app-sidebar-account-name">
												{user?.name ?? t("Navbar.account.fallback")}
											</p>
											<p className="app-sidebar-account-meta">
												{admin?.accountResponse.email ??
													t("Navbar.account.fallback")}
											</p>
											<p className="app-sidebar-account-meta">
												{admin?.campus.campusFormatted ??
													t("Navbar.account.fallback")}
											</p>
										</>
									)}
								</div>
							</div>
							<Separator className="separator-horizontal" />
							<Button
								className="w-full justify-start"
								usage="secondary"
								variant="secondary"
								onClick={handleOpenLogoutDialog}
								leadingIcon={
									<Icon
										icon={LogOut}
										size={16}
									/>
								}
							>
								{t("Navbar.account.logout")}
							</Button>
						</>
					)}
				</PopoverContent>
			</Popover>
			<AlertDialog
				open={isLogoutDialogOpen}
				onOpenChange={nextOpen => {
					if (!isPending) setIsLogoutDialogOpen(nextOpen);
				}}
			>
				<AlertDialogContent className="sm:max-w-[42rem]">
					<AlertDialogHeader>
						<AlertDialogTitle>
							{t("Navbar.account.logoutDialogTitle")}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t("Navbar.account.logoutDialogDescription")}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="sm:flex-nowrap">
						<Button
							className="ml-auto whitespace-nowrap"
							variant="secondary"
							disabled={isPending}
							onClick={() => setIsLogoutDialogOpen(false)}
						>
							{t("Navbar.account.logoutCancel")}
						</Button>
						<Button
							className="whitespace-nowrap"
							variant="secondary"
							disabled={isPending && pendingScope !== "all"}
							isLoading={isPending && pendingScope === "all"}
							loadingText={t("Navbar.account.logoutAllPending")}
							onClick={() => handleLogout("all")}
						>
							{t("Navbar.account.logoutAllDevices")}
						</Button>
						<Button
							className="whitespace-nowrap"
							disabled={isPending && pendingScope !== "current"}
							isLoading={isPending && pendingScope === "current"}
							loadingText={t("Navbar.account.logoutCurrentPending")}
							onClick={() => handleLogout("current")}
						>
							{t("Navbar.account.logoutCurrentDevice")}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
