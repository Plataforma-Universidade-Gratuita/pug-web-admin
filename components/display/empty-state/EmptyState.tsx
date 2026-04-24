import clsx from "clsx";

import { Content, Footer, Header } from "@/components/structure/layout/Layout";
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
			className={clsx("empty-state-root", className)}
			{...props}
		>
			<Header className="empty-state-copy">
				{icon ? <div className="empty-state-icon">{icon}</div> : null}

				<div className="empty-state-copy">
					<h3 className="section-title">{title}</h3>
					<p className="section-description">{description}</p>
				</div>
			</Header>

			{children ? <Content className="w-full">{children}</Content> : null}

			{actions ? <Footer className="section-actions">{actions}</Footer> : null}
		</div>
	);
}
