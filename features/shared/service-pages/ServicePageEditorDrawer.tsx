import clsx from "clsx";

import {
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	Tabs,
} from "@/components";
import type { ServicePageEditorDrawerProps } from "@/types";

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
	const drawerBody = (
		<DrawerBody className={bodyClassName}>{children}</DrawerBody>
	);

	return (
		<Drawer
			open={open}
			onOpenChange={onOpenChange}
			isLoading={isLoading}
			loadingLabel={loadingLabel}
		>
			<DrawerContent>
				<DrawerHeader overhead={overhead}>
					<DrawerTitle>{title}</DrawerTitle>
				</DrawerHeader>

				{tabs ? (
					<Tabs
						{...tabs}
						className={clsx("service-page-editor-tabs-root", tabs.className)}
					>
						<div className="service-page-editor-tabs">{tabs.list}</div>
						{drawerBody}
					</Tabs>
				) : (
					drawerBody
				)}

				{footer}
			</DrawerContent>
		</Drawer>
	);
}
