import Link from "next/link";

import clsx from "clsx";
import type { DocsTextLinkProps } from "@/types/client";

export function DocsTextLink({ children, className, href }: DocsTextLinkProps) {
	return (
		<Link
			href={href}
			className={clsx(
				"ty-sm-semibold text-[color:var(--color-brand)] underline underline-offset-4",
				className,
			)}
		>
			{children}
		</Link>
	);
}
