"use client";

import { useMemo, useState } from "react";

import { usePathname } from "next/navigation";

import clsx from "clsx";
import { useTranslation } from "react-i18next";

import {
	Icon as AppIcon,
	Popover,
	PopoverContent,
	PopoverTrigger,
	ScrollArea,
} from "@/components";
import { MenuItem } from "@/features/app-shell/Sidebar/MenuItem";
import { SidebarRow } from "@/features/app-shell/Sidebar/SidebarRow";
import { isLeafItem, isNodeActive } from "@/features/app-shell/Sidebar/utils";
import type {
	MenuGroupProps,
	PopoverGroupListProps,
	PopoverGroupProps,
} from "@/types/client";

function PopoverGroupList({
	items,
	pathname,
	closePopover,
	depth = 0,
}: PopoverGroupListProps) {
	return (
		<ul className={clsx("app-sidebar-group-list", depth > 0 && "mt-2")}>
			{items.map(item =>
				isLeafItem(item) ? (
					<li key={item.href}>
						<SidebarRow
							kind="link"
							href={item.href}
							label={item.label}
							Icon={item.Icon}
							active={isNodeActive(pathname, item)}
							depth={depth}
							iconSize={16}
							onSelect={closePopover}
						/>
					</li>
				) : (
					<PopoverGroup
						key={`${item.label}-${depth + 1}`}
						item={item}
						pathname={pathname}
						closePopover={closePopover}
						depth={depth}
					/>
				),
			)}
		</ul>
	);
}

function PopoverGroup({
	item,
	pathname,
	closePopover,
	depth,
}: PopoverGroupProps) {
	const active = item.childrenItems.some(child =>
		isNodeActive(pathname, child),
	);
	const [manualOpenState, setManualOpenState] = useState<{
		pathname: string;
		value: boolean;
	} | null>(null);
	const open =
		manualOpenState?.pathname === pathname ? manualOpenState.value : active;

	return (
		<li>
			<SidebarRow
				kind="button"
				label={item.label}
				Icon={item.Icon}
				active={active}
				depth={depth}
				iconSize={16}
				ariaExpanded={open}
				onPress={() =>
					setManualOpenState({
						pathname,
						value: !open,
					})
				}
			/>
			<div
				className="app-sidebar-group-children"
				data-open={open ? "true" : "false"}
			>
				<PopoverGroupList
					items={item.childrenItems}
					pathname={pathname}
					closePopover={closePopover}
					depth={depth + 1}
				/>
			</div>
		</li>
	);
}

export function MenuGroup({
	collapsed,
	label,
	Icon,
	childrenItems,
	depth = 0,
}: MenuGroupProps) {
	const { t } = useTranslation();
	const pathname = usePathname();

	const hasActiveChild = useMemo(
		() => childrenItems.some(item => isNodeActive(pathname, item)),
		[pathname, childrenItems],
	);

	const [overrideState, setOverrideState] = useState<{
		pathname: string;
		value: boolean;
	} | null>(null);
	const [manualOpen, setManualOpen] = useState(false);

	const openExpanded =
		overrideState?.pathname === pathname ? overrideState.value : hasActiveChild;
	const open = collapsed ? manualOpen : openExpanded;

	const onHeaderClick = () => {
		if (collapsed) return;
		else
			setOverrideState({
				pathname,
				value: !openExpanded,
			});
	};

	const Header = (
		<SidebarRow
			kind="button"
			label={label}
			Icon={Icon}
			active={hasActiveChild}
			collapsed={collapsed}
			depth={depth}
			ariaExpanded={open}
			onPress={collapsed ? () => undefined : onHeaderClick}
		/>
	);

	const CollapsedTrigger = (
		<button
			type="button"
			aria-label={t(label)}
			aria-expanded={manualOpen}
			className={clsx(
				"app-sidebar-item focus-ring",
				hasActiveChild ? "app-sidebar-item-active" : null,
			)}
		>
			<AppIcon
				icon={Icon}
				size={20}
				strokeWidth={2}
				tooltipContent={t(label)}
				decorative
				className={clsx(
					"app-sidebar-item-icon",
					hasActiveChild ? "app-sidebar-item-icon-active" : null,
				)}
			/>
		</button>
	);

	const ChildrenList = (
		<ul className="app-sidebar-group-list">
			{childrenItems.map(item =>
				isLeafItem(item) ? (
					<MenuItem
						key={item.href}
						collapsed={collapsed}
						href={item.href}
						label={item.label}
						Icon={item.Icon}
						active={isNodeActive(pathname, item)}
						depth={depth + 1}
					/>
				) : (
					<MenuGroup
						key={`${item.label}-${depth + 1}`}
						collapsed={collapsed}
						label={item.label}
						Icon={item.Icon}
						childrenItems={item.childrenItems}
						depth={depth + 1}
					/>
				),
			)}
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
			<Popover
				open={manualOpen}
				onOpenChange={setManualOpen}
				modal={false}
			>
				<PopoverTrigger>{CollapsedTrigger}</PopoverTrigger>
				<PopoverContent
					side="right"
					align="start"
					sideOffset={15}
					collisionPadding={8}
					onCloseAutoFocus={() => setManualOpen(false)}
					onEscapeKeyDown={() => setManualOpen(false)}
					className="app-sidebar-popover"
				>
					<div className="app-sidebar-popover-title">{t(label)}</div>
					<ScrollArea
						className="app-sidebar-popover-scroll"
						viewportClassName="app-sidebar-popover-scroll-viewport"
					>
						<PopoverGroupList
							items={childrenItems}
							pathname={pathname}
							closePopover={() => setManualOpen(false)}
						/>
					</ScrollArea>
				</PopoverContent>
			</Popover>
		</li>
	);
}
