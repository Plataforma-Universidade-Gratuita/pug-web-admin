"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import * as Popover from "@radix-ui/react-popover";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Icon as AppIcon } from "@/components";
import type { MenuGroupProps } from "@/types/client";

export function MenuGroup({
	collapsed,
	label,
	Icon,
	childrenItems,
}: MenuGroupProps) {
	const { t } = useTranslation();
	const pathname = usePathname();

	const hasActiveChild = useMemo(
		() =>
			childrenItems.some(
				({ href }) => pathname === href || pathname.startsWith(href + "/"),
			),
		[pathname, childrenItems],
	);

	const [overrideOpen, setOverrideOpen] = useState<null | boolean>(null);
	const [manualOpen, setManualOpen] = useState(false);

	const openExpanded = overrideOpen ?? hasActiveChild;
	const open = collapsed ? manualOpen : openExpanded;

	useEffect(() => {
		setOverrideOpen(null);
	}, [pathname]);

	const onHeaderClick = () => {
		if (collapsed) setManualOpen(v => !v);
		else setOverrideOpen(v => (v === null ? !openExpanded : !v));
	};

	const Header = (
		<button
			type="button"
			aria-expanded={open}
			onClick={onHeaderClick}
			className={clsx(
				"app-sidebar-item focus-ring",
				hasActiveChild ? "app-sidebar-item-active" : null,
			)}
		>
			<AppIcon
				icon={Icon}
				size={20}
				strokeWidth={2}
				className={clsx(
					"app-sidebar-item-icon",
					hasActiveChild ? "app-sidebar-item-icon-active" : null,
				)}
			/>
			{!collapsed && (
				<>
					<span
						className={clsx(
							"app-sidebar-item-label truncate",
							hasActiveChild ? "app-sidebar-item-label-active" : null,
						)}
					>
						{t(label)}
					</span>
					<AppIcon
						icon={ChevronDown}
						size={16}
						className={`transition-transform ${open ? "rotate-180" : ""}`}
						containerClassName="ml-auto"
					/>
				</>
			)}
		</button>
	);

	const ChildrenList = (
		<ul className="app-sidebar-group-list">
			{childrenItems.map(({ href, label, Icon }) => {
				const active = pathname === href || pathname.startsWith(href + "/");
				return (
					<li key={href}>
						<Link
							href={href}
							title={t(label)}
							aria-current={active ? "page" : undefined}
							className={clsx(
								"app-sidebar-item",
								active ? "app-sidebar-item-active" : null,
							)}
							onClick={e => {
								setManualOpen(false);
								if (active) {
									e.preventDefault();
									return;
								}
							}}
						>
							<AppIcon
								icon={Icon}
								size={18}
								strokeWidth={2}
								className={clsx(
									"app-sidebar-item-icon",
									active ? "app-sidebar-item-icon-active" : null,
								)}
							/>
							<span
								className={clsx(
									"app-sidebar-item-label truncate",
									active ? "app-sidebar-item-label-active" : null,
								)}
							>
								{t(label)}
							</span>
						</Link>
					</li>
				);
			})}
		</ul>
	);

	if (!collapsed) {
		return (
			<li>
				{Header}
				<div
					className="app-sidebar-group-children"
					data-open={open ? "true" : "false"}
				>
					{ChildrenList}
				</div>
			</li>
		);
	}

	return (
		<li>
			<Popover.Root
				open={manualOpen}
				onOpenChange={setManualOpen}
				modal={false}
			>
				<Popover.Trigger asChild>{Header}</Popover.Trigger>
				<Popover.Portal>
					<Popover.Content
						side="right"
						align="start"
						sideOffset={15}
						collisionPadding={8}
						onCloseAutoFocus={() => setManualOpen(false)}
						onEscapeKeyDown={() => setManualOpen(false)}
						className="app-sidebar-popover"
					>
						<div className="app-sidebar-popover-title">{t(label)}</div>
						<ul className="app-sidebar-popover-list">
							{childrenItems.map(({ href, label, Icon }) => {
								const active =
									pathname === href || pathname.startsWith(href + "/");
								return (
									<li key={href}>
										<Link
											href={href}
											title={t(label)}
											aria-current={active ? "page" : undefined}
											className={clsx(
												"app-sidebar-item",
												active ? "app-sidebar-item-active" : null,
											)}
											onClick={e => {
												setManualOpen(false);
												if (active) {
													e.preventDefault();
													return;
												}
											}}
										>
											<AppIcon
												icon={Icon}
												size={16}
												strokeWidth={2}
												className={clsx(
													"app-sidebar-item-icon",
													active ? "app-sidebar-item-icon-active" : null,
												)}
											/>
											<span
												className={clsx(
													"app-sidebar-item-label truncate",
													active ? "app-sidebar-item-label-active" : null,
												)}
											>
												{t(label)}
											</span>
										</Link>
									</li>
								);
							})}
						</ul>
						<Popover.Arrow className="app-sidebar-popover-arrow" />
					</Popover.Content>
				</Popover.Portal>
			</Popover.Root>
		</li>
	);
}
