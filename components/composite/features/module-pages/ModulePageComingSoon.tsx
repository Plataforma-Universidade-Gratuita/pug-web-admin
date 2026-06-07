"use client";

import Link from "next/link";

import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { EmptyState, Icon } from "@/components/primitives";
import type { ModulePageComingSoonProps } from "@/types/client";

export function ModulePageComingSoon({
	className,
	description,
	moduleName,
	paths,
	title,
}: ModulePageComingSoonProps) {
	const { t } = useTranslation();

	return (
		<EmptyState
			className={className}
			icon={undefined}
			title={title ?? t("modulePages.comingSoon.title")}
			description={
				description ??
				t("modulePages.comingSoon.description", {
					moduleName,
				})
			}
		>
			{paths?.length ? (
				<div className="grid w-full max-w-2xl gap-3">
					<p className="ty-helper">
						{t("modulePages.comingSoon.availablePages")}
					</p>
					<div className="grid gap-3">
						{paths.map(path => (
							<Link
								key={path.href}
								href={path.href}
								className="shadow-normal grid gap-1 rounded-[calc(var(--twc-radius-xl)+0.25rem)] border border-[color:var(--twc-border-2)] bg-[color:var(--twc-surface-2)] p-4 transition-colors hover:bg-[color:var(--twc-surface-1)]"
							>
								<div className="flex items-center justify-between gap-3">
									<p className="ty-sm-semibold">{path.label}</p>
									<Icon
										icon={ArrowRight}
										className="h-4 w-4 text-[color:var(--twc-muted)]"
									/>
								</div>
								{path.description ? (
									<p className="section-description max-w-none">
										{path.description}
									</p>
								) : null}
							</Link>
						))}
					</div>
				</div>
			) : null}
		</EmptyState>
	);
}
