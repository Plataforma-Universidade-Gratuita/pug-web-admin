"use client";

import {
	useEffect,
	useMemo,
	useState,
	type ForwardRefExoticComponent,
	type RefAttributes,
} from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import * as Popover from "@radix-ui/react-popover";
import { ChevronDown, type LucideProps } from "lucide-react";
import { useTranslation } from "react-i18next";

type IconType = ForwardRefExoticComponent<
	Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;
type Child = { href: string; label: string; Icon: IconType };

export function MenuGroup({
	collapsed,
	label,
	Icon,
	childrenItems,
}: {
	collapsed: boolean;
	label: string;
	Icon: IconType;
	childrenItems: Child[];
}) {
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
				"surface-2 hover:surface-3 shadow-weak cursor-pointer",
				hasActiveChild ? "hover:surface-2! surface-3!" : "",
			].join(" ")}
		>
			<Icon
				size={20}
				strokeWidth={2}
				className={`shrink-0 ${hasActiveChild ? "fill-brand-700/25 stroke-brand-700" : "text-base-800"}`}
			/>
			{!collapsed && (
				<>
					<span
						className={`ty-sm truncate ${hasActiveChild ? "text-brand-700 font-semibold" : ""}`}
					>
						{t(label)}
					</span>
					<ChevronDown
						size={16}
						className={`ml-auto transition-transform ${open ? "rotate-180" : ""}`}
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
								"surface-2 hover:surface-3 shadow-weak no-underline",
								active ? "bg-brand/15! cursor-default!" : "",
							].join(" ")}
							onClick={(e) => {
								setManualOpen(false);
								if (active) {
									e.preventDefault();
									return;
								}
							}}
						>
							<Icon
								size={18}
								strokeWidth={2}
								className={`shrink-0 ${active ? "fill-brand-700/25 stroke-brand-700" : ""}`}
							/>
							<span
								className={`ty-sm truncate ${active ? "font-semibold" : ""}`}
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
						className="surface-2 br-squircle shadow-weak border-default z-50 p-2"
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
												active ? "bg-brand-500/15! ty-sm-semibold cursor-default!" : "",
											].join(" ")}
											onClick={(e) => {
												setManualOpen(false);
												if (active) {
													e.preventDefault();
													return;
												}
											}}	
										>
											<Icon
												size={16}
												strokeWidth={2}
												className={`shrink-0 ${active ? "fill-brand-700/25 stroke-brand-700" : ""}`}
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
