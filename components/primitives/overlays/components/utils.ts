/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */

export function getControllableOverlayRootProps(
	open?: boolean,
	defaultOpen?: boolean,
	onOpenChange?: (open: boolean) => void,
) {
	const rootProps: Partial<{
		open: boolean;
		defaultOpen: boolean;
		onOpenChange: (open: boolean) => void;
	}> = {};

	if (open !== undefined) rootProps.open = open;
	if (defaultOpen !== undefined) rootProps.defaultOpen = defaultOpen;
	if (onOpenChange !== undefined) rootProps.onOpenChange = onOpenChange;

	return rootProps;
}
