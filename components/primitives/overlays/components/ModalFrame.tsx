import type { ReactNode } from "react";

import { APP_TOPBAR_HEIGHT } from "@/components/primitives/overlays/constants";

interface ModalFrameProps {
	children: ReactNode;
}

export function ModalFrame({ children }: ModalFrameProps) {
	return (
		<div
			className="modal-frame"
			style={{ top: APP_TOPBAR_HEIGHT }}
		>
			{children}
		</div>
	);
}
