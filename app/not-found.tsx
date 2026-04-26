import { RouteBoundaryScreen } from "@/features/routing/RouteBoundaryScreen";

export function NotFoundPageContent() {
	return (
		<RouteBoundaryScreen
			variant="not-found"
			mode="full"
		/>
	);
}

export default function NotFoundPage() {
	return <NotFoundPageContent />;
}
