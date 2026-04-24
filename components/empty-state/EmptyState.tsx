import clsx from "clsx";

import { Content, Footer, Header } from "@/components";
import type { EmptyStateProps } from "@/types/client";

export function EmptyState({
	actions,
	children,
	className,
	description,
	icon,
	title,
	...props
}: EmptyStateProps) {
	return (
		<div
			className={clsx(
				"flex flex-col items-start gap-6 rounded-[var(--twc-radius-xl)]",
				className,
			)}
			{...props}
		>
			<Header className="space-y-4">
				{icon ? (
					<div className="surface-2 flex h-12 w-12 items-center justify-center rounded-[var(--twc-radius-lg)]">
						{icon}
					</div>
				) : null}

				<div className="space-y-1">
					<h3 className="ty-header">{title}</h3>
					<p className="ty-body text-[color:var(--twc-muted)]">{description}</p>
				</div>
			</Header>

			{children ? <Content className="w-full">{children}</Content> : null}

			{actions ? (
				<Footer className="flex flex-wrap gap-3">{actions}</Footer>
			) : null}
		</div>
	);
}
