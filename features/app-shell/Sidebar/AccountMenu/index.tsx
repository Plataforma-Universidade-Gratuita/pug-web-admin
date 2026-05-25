"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { LogOut, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";

import { logout, logoutAll } from "@/api/web/identity/auth";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
	Button,
	Footer,
	Icon,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Separator,
	Skeleton,
	toast,
} from "@/components";
import { LOGIN_ROUTE } from "@/constants";
import {
	adminQueryKeys,
	useCurrentAdminQuery,
} from "@/features/identity/admins/queries";
import {
	userQueryKeys,
	useCurrentUserQuery,
} from "@/features/identity/users/queries";
import type { SidebarProps } from "@/types";
import type { LogoutScope } from "@/types";

export function AccountMenu({ collapsed }: Pick<SidebarProps, "collapsed">) {
	const queryClient = useQueryClient();
	const router = useRouter();
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [pendingScope, setPendingScope] = useState<LogoutScope | null>(null);
	const { data: admin } = useCurrentAdminQuery();
	const { data: user } = useCurrentUserQuery();
	const isProfileLoading = !admin || !user;

	async function finalizeLogout(successMessage: string) {
		await queryClient.invalidateQueries({ queryKey: adminQueryKeys.all });
		await queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
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
						variant="ghost"
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
										{admin?.accountEmail ?? t("Navbar.account.fallback")}
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
						variant="ghost"
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
					<Footer className="alert-dialog-footer dialog-footer sm:flex-nowrap">
						<Button
							className="whitespace-nowrap"
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
					</Footer>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
