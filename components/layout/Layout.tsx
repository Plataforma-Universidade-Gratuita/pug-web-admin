import clsx from "clsx";
import type { ContentProps, FooterProps, HeaderProps } from "types/client";

export function Header({ children, className, ...props }: HeaderProps) {
	return (
		<div
			className={clsx(className)}
			{...props}
		>
			{children}
		</div>
	);
}

export function Content({ children, className, ...props }: ContentProps) {
	return (
		<div
			className={clsx(className)}
			{...props}
		>
			{children}
		</div>
	);
}

export function Footer({ children, className, ...props }: FooterProps) {
	return (
		<div
			className={clsx(className)}
			{...props}
		>
			{children}
		</div>
	);
}
