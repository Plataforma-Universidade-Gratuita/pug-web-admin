"use client";

import Link from "next/link";

import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { Icon as AppIcon, Tooltip } from "@/components/primitives";
import { getSidebarRowStyle } from "@/features/app-shell/Sidebar/utils";
import type { SidebarRowProps } from "@/types/client";

export function SidebarRow(props: SidebarRowProps) {
	const { t } = useTranslation();
	const {
		active,
		collapsed = false,
		depth = 0,
		iconSize = 20,
		Icon,
		label,
	} = props;

	const content = (
		<>
			<AppIcon
				icon={Icon}
				size={iconSize}
				strokeWidth={2}
				className={clsx(
					"app-sidebar-item-icon",
					active && "app-sidebar-item-icon-active",
				)}
			/>
			{!collapsed ? (
				<span
					className={clsx(
						"app-sidebar-item-label truncate",
						active && "app-sidebar-item-label-active",
					)}
				>
					{t(label)}
				</span>
			) : null}
		</>
	);

	const sharedProps = {
		className: clsx("app-sidebar-item", active && "app-sidebar-item-active"),
		style: getSidebarRowStyle(depth, collapsed),
	};

	const withTooltip = (node: React.ReactNode) =>
		collapsed ? <Tooltip content={t(label)}>{node}</Tooltip> : node;

	if (props.kind === "link") {
		return withTooltip(
			<Link
				href={props.href}
				aria-current={active ? "page" : undefined}
				{...sharedProps}
				onClick={event => {
					props.onSelect?.();
					if (active) {
						event.preventDefault();
					}
				}}
			>
				{content}
			</Link>,
		);
	}

	return withTooltip(
		<button
			type="button"
			aria-expanded={props.ariaExpanded}
			{...sharedProps}
			onClick={props.onPress}
		>
			{content}
		</button>,
	);
}
