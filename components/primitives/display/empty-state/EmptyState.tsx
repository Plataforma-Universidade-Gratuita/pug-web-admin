"use client";

import clsx from "clsx";
import { Inbox, RotateCcw, SearchX, TriangleAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components";
import { Content, Footer, Header } from "@/components";
import type {
	EmptyStateProps,
	NoContentStateProps,
	NotFoundStateProps,
	SomeErrorStateProps,
} from "@/types";

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

			{actions ? (
				<Footer className="section-actions w-full">{actions}</Footer>
			) : null}
		</div>
	);
}

export function NoContentState({
	className,
	description,
	title,
	...props
}: NoContentStateProps) {
	const { t } = useTranslation();

	return (
		<EmptyState
			className={className}
			icon={<Inbox className="h-5 w-5 text-[color:var(--twc-muted)]" />}
			title={title}
			description={
				description ?? t("components.emptyState.presets.noContent.description")
			}
			{...props}
		/>
	);
}

export function SomeErrorState({
	className,
	description,
	onRefresh,
	title,
	...props
}: SomeErrorStateProps) {
	const { t } = useTranslation();

	return (
		<EmptyState
			className={className}
			icon={
				<TriangleAlert className="h-5 w-5 text-[color:var(--color-danger)]" />
			}
			title={title}
			description={description}
			actions={
				<Button
					className="w-full"
					variant="secondary"
					leadingIcon={<RotateCcw className="h-4 w-4" />}
					onClick={onRefresh}
				>
					{t("components.emptyState.presets.someError.refresh")}
				</Button>
			}
			{...props}
		/>
	);
}

export function NotFoundState({
	className,
	description,
	title,
	...props
}: NotFoundStateProps) {
	const { t } = useTranslation();

	return (
		<EmptyState
			className={className}
			icon={<SearchX className="h-5 w-5 text-[color:var(--twc-muted)]" />}
			title={title}
			description={
				description ?? t("components.emptyState.presets.notFound.description")
			}
			{...props}
		/>
	);
}
