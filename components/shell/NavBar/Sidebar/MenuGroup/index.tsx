"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import * as Popover from "@radix-ui/react-popover";
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
			className={[
				"group relative flex h-10 w-full items-center gap-2 rounded-2xl px-[0.725rem]",
				"surface-2 hover:surface-3 shadow-weak cursor-pointer transition-colors",
				hasActiveChild
					? "bg-[color:color-mix(in_oklab,var(--color-brand)_10%,transparent)] hover:bg-[color:color-mix(in_oklab,var(--color-brand)_10%,transparent)]"
					: "",
			].join(" ")}
		>
			<AppIcon
				icon={Icon}
				size={20}
				strokeWidth={2}
				className={
					hasActiveChild
						? "stroke-brand fill-[color:color-mix(in_oklab,var(--color-brand)_18%,transparent)]"
						: "text-base-800"
				}
			/>
			{!collapsed && (
				<>
					<span
						className={`ty-sm truncate ${hasActiveChild ? "text-brand font-semibold" : ""}`}
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
		<ul className="mt-2 space-y-2 pb-2 pl-2">
			{childrenItems.map(({ href, label, Icon }) => {
				const active = pathname === href || pathname.startsWith(href + "/");
				return (
					<li key={href}>
						<Link
							href={href}
							title={t(label)}
							aria-current={active ? "page" : undefined}
							className={[
								"group relative flex h-10 w-full items-center gap-2 rounded-2xl px-[0.725rem]",
								"surface-2 hover:surface-3 shadow-weak no-underline transition-colors",
								active
									? "cursor-default! bg-[color:color-mix(in_oklab,var(--color-brand)_12%,transparent)]"
									: "",
							].join(" ")}
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
								className={
									active
										? "stroke-brand fill-[color:color-mix(in_oklab,var(--color-brand)_18%,transparent)]"
										: undefined
								}
							/>
							<span
								className={`ty-sm truncate ${active ? "text-brand font-semibold" : ""}`}
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
					className={[
						"overflow-hidden transition-[max-height,opacity,transform] duration-200",
						open
							? "max-h-96 translate-y-0 opacity-100"
							: "max-h-0 -translate-y-1 opacity-0",
					].join(" ")}
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
						className="surface-2 br-squircle shadow-weak border-default-3 z-50 border p-2"
					>
						<div className="ty-sm-semibold mb-1 px-2">{t(label)}</div>
						<ul className="w-48 space-y-1">
							{childrenItems.map(({ href, label, Icon }) => {
								const active =
									pathname === href || pathname.startsWith(href + "/");
								return (
									<li key={href}>
										<Link
											href={href}
											title={t(label)}
											aria-current={active ? "page" : undefined}
											className={[
												"ty-sm br-squircle shadow-weak w-full px-3 py-2 text-left",
												"surface-2 hover:surface-3 flex items-center gap-2 no-underline",
												active
													? "text-brand ty-sm-semibold cursor-default! bg-[color:color-mix(in_oklab,var(--color-brand)_12%,transparent)]"
													: "",
											].join(" ")}
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
												className={
													active
														? "stroke-brand fill-[color:color-mix(in_oklab,var(--color-brand)_18%,transparent)]"
														: undefined
												}
											/>
											<span className="truncate">{t(label)}</span>
										</Link>
									</li>
								);
							})}
						</ul>
						<Popover.Arrow className="fill-base-100" />
					</Popover.Content>
				</Popover.Portal>
			</Popover.Root>
		</li>
	);
}
