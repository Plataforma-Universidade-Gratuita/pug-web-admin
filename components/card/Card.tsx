import clsx from "clsx";
import { Content, Footer, Header } from "components/layout/Layout";
import type {
	CardContentProps,
	CardDescriptionProps,
	CardFooterProps,
	CardHeaderProps,
	CardProps,
	CardTitleProps,
} from "types/client";

export function Card({ children, className, ...props }: CardProps) {
	return (
		<div
			className={clsx(
				"border-default-2 surface-1 rounded-[var(--twc-radius-xl)] border",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
	return (
		<Header
			className={clsx("space-y-1", className)}
			{...props}
		>
			{children}
		</Header>
	);
}

export function CardTitle({ children, className, ...props }: CardTitleProps) {
	return (
		<h3
			className={clsx("ty-sm-bold", className)}
			{...props}
		>
			{children}
		</h3>
	);
}

export function CardDescription({
	children,
	className,
	...props
}: CardDescriptionProps) {
	return (
		<p
			className={clsx("ty-helper", className)}
			{...props}
		>
			{children}
		</p>
	);
}

export function CardContent({
	children,
	className,
	...props
}: CardContentProps) {
	return (
		<Content
			className={className}
			{...props}
		>
			{children}
		</Content>
	);
}

export function CardFooter({ children, className, ...props }: CardFooterProps) {
	return (
		<Footer
			className={className}
			{...props}
		>
			{children}
		</Footer>
	);
}
