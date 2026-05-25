import type { RefObject } from "react";

export interface PopoverContextValue {
	triggerRef: RefObject<HTMLSpanElement | null>;
}
