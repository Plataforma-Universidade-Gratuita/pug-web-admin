"use client";

import {
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
	const activeChildItem = useMemo(
		() =>
			childrenItems.find(
				({ href }) => pathname === href || pathname.startsWith(href + "/"),
			),
		[pathname, childrenItems],
	);
	const activeChild = useMemo(
		() =>
			childrenItems.some(
				({ href }) => pathname === href || pathname.startsWith(href + "/"),
			),
		[pathname, childrenItems],
	);
	const [manualOpen, setManualOpen] = useState(false);
	const open = manualOpen || activeChild;
	const handleModalClose = () => {
		setManualOpen(false);
	};

	const Header = (
		<button
			type="button"
			aria-expanded={open}
			onClick={() => setManualOpen(v => !v)}
			className={[
				"group relative flex h-10 w-full items-center gap-2 rounded-2xl px-[0.725rem]",
				"surface-2 hover:surface-3 shadow-weak",
				activeChild ? "surface-3!" : "",
			].join(" ")}
		>
			<Icon
				size={20}
				strokeWidth={2}
				className={`shrink-0 ${activeChild ? "fill-brand-700/25 stroke-brand-700" : "text-base-800"}`}
			/>
			{!collapsed && (
				<>
					<span
						className={`ty-sm truncate ${activeChild ? "text-brand-700 font-semibold" : ""}`}
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
					<ul className="mt-2 space-y-2 pb-2 pl-2">
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
											"group relative flex h-10 w-full items-center gap-2 rounded-2xl px-[0.725rem]",
											"surface-2 hover:surface-3 shadow-weak no-underline",
											active ? "bg-brand/15!" : "",
										].join(" ")}
										onClick={() => setManualOpen(false)}
									>
										<Icon
											size={18}
											strokeWidth={2}
											className={`shrink-0 ${active ? "fill-brand-700/25 stroke-brand-700" : ""}`}
										/>
										<span
											className={`ty-sm truncate ${active ? "text-brand-700 font-semibold" : ""}`}
										>
											{t(label)}
										</span>
									</Link>
								</li>
							);
						})}
					</ul>
				</div>
			</li>
		);
	}

	return (
		<>
			<li>
				<Popover.Root
					open={open}
					onOpenChange={setManualOpen}
				>
					<Popover.Trigger asChild>{Header}</Popover.Trigger>
					<Popover.Portal>
						<Popover.Content
							side="right"
							align="start"
							sideOffset={15}
							collisionPadding={8}
							onCloseAutoFocus={handleModalClose}
							onEscapeKeyDown={handleModalClose}
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
													active ? "bg-brand-500/15! ty-sm-semibold" : "",
												].join(" ")}
												onClick={() => setManualOpen(false)}
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

			{activeChildItem && (
				<li>
					<Link
						href={activeChildItem.href}
						aria-current="page"
						className={[
							"group relative flex h-10 w-full items-center gap-2 rounded-2xl px-[0.725rem]",
							"surface-2 shadow-weak bg-brand/15! no-underline",
						].join(" ")}
					>
						<activeChildItem.Icon
							size={20}
							strokeWidth={2}
							className="fill-brand-700/25 stroke-brand-700 shrink-0"
						/>
					</Link>
				</li>
			)}
		</>
	);
}
