import clsx from "clsx";

import {
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	Tabs,
} from "@/components/primitives";
import type { ServicePageEditorDrawerProps } from "@/types/client";

export function ServicePageEditorDrawer({
	bodyClassName,
	children,
	footer,
	isLoading = false,
	loadingLabel,
	onOpenChange,
	open,
	overhead,
	tabs,
	title,
}: ServicePageEditorDrawerProps) {
	const drawerProps = {
		open,
		onOpenChange,
		isLoading,
		...(loadingLabel ? { loadingLabel } : {}),
	};
	const drawerBodyProps = bodyClassName ? { className: bodyClassName } : {};

	return (
		<Drawer {...drawerProps}>
			<DrawerContent>
				<DrawerHeader overhead={overhead}>
					<DrawerTitle>{title}</DrawerTitle>
				</DrawerHeader>

				<DrawerBody {...drawerBodyProps}>
					{tabs ? (
						<Tabs
							{...tabs}
							className={clsx("service-page-editor-tabs-root", tabs.className)}
						>
							<div className="service-page-editor-tabs">{tabs.list}</div>
							{children}
						</Tabs>
					) : (
						children
					)}
				</DrawerBody>

				{footer}
			</DrawerContent>
		</Drawer>
	);
}
