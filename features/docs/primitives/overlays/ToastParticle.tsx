"use client";

import {
	AlertCircle,
	Bell,
	CheckCircle2,
	Info,
	LoaderCircle,
	RotateCcw,
	TriangleAlert,
} from "lucide-react";

import { Button, Icon, toast } from "@/components";
import { ParticleContainer } from "@/features/docs/primitives/ParticleContainer";
import { ParticleSection } from "@/features/docs/primitives/ParticleSection";
import { wait } from "@/features/docs/primitives/overlays/utils";

export default function ToastParticle() {
	return (
		<ParticleContainer
			eyebrow="Feedback"
			title="Toast"
			description="Transient feedback for neutral updates, async work, and reversible actions."
			patternNotesTitle="Toast guidance"
			patternNotesItems={[
				{
					description:
						"Use the neutral toast for routine confirmations and reserve intentional variants for state changes that need extra emphasis.",
				},
				{
					description:
						"Descriptions should add one useful line of context, not repeat the title.",
				},
				{
					description:
						"Undo is the preferred pattern for deletes or updates that can be reversed quickly.",
				},
				{
					description:
						"Promise toasts should reflect the real lifecycle of the async operation instead of stacking separate loading and success calls.",
				},
			]}
			patternNotesApiLabel="Toast API"
			patternNotesSnippet={`toast("Settings saved", {
	description: "All profile changes are now live.",
});

toast.success("Enrollment updated", {
	description: "The new classroom is now assigned.",
});

toast.undo("Student removed from the group", {
	description: "You have 5 seconds to restore the enrollment.",
	onUndo: () => restoreStudent(),
});

toast.promise(saveSettings(), {
	loading: "Saving settings...",
	success: "Settings saved",
	error: "Unable to save settings",
	description: "The notification preferences were updated.",
});

toast.danger("403 Forbidden", {
	description: "You do not have permission to delete this enrollment.",
});`}
		>
			<ParticleSection
				title="Intent variants"
				description="Neutral and intentional color treatments for the most common feedback states."
				defaultExpanded
			>
				<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
					<Button
						usage="secondary"
						variant="flat"
						leadingIcon={
							<Icon
								icon={Bell}
								className="h-4 w-4"
							/>
						}
						onClick={() =>
							toast("Draft saved", {
								description: "Your changes are available on this device.",
							})
						}
					>
						Neutral
					</Button>
					<Button
						usage="info"
						variant="flat"
						leadingIcon={
							<Icon
								icon={Info}
								className="h-4 w-4"
							/>
						}
						onClick={() =>
							toast.info("Sync started", {
								description: "New records are being pulled from the API.",
							})
						}
					>
						Info
					</Button>
					<Button
						usage="success"
						variant="flat"
						leadingIcon={
							<Icon
								icon={CheckCircle2}
								className="h-4 w-4"
							/>
						}
						onClick={() =>
							toast.success("User updated", {
								description: "The profile details were saved successfully.",
							})
						}
					>
						Success
					</Button>
					<Button
						usage="warning"
						variant="flat"
						leadingIcon={
							<Icon
								icon={TriangleAlert}
								className="h-4 w-4"
							/>
						}
						onClick={() =>
							toast.warning("Storage almost full", {
								description: "Less than 10% of the quota is available.",
							})
						}
					>
						Warning
					</Button>
					<Button
						usage="danger"
						variant="flat"
						leadingIcon={
							<Icon
								icon={TriangleAlert}
								className="h-4 w-4"
							/>
						}
						onClick={() =>
							toast.danger("Update failed", {
								description: "The request was rejected by the server.",
							})
						}
					>
						Danger
					</Button>
				</div>
			</ParticleSection>

			<ParticleSection
				title="Async and undo"
				description="Promise-driven feedback and reversible actions use the same API surface."
				defaultExpanded
			>
				<div className="grid gap-3 md:grid-cols-3">
					<Button
						usage="primary"
						leadingIcon={
							<Icon
								icon={LoaderCircle}
								className="h-4 w-4"
							/>
						}
						onClick={() =>
							toast.promise(
								wait(1200).then(() => "Notification preferences"),
								{
									loading: "Saving settings...",
									success: value => `${value} saved`,
									error: "Unable to save settings",
									description: value =>
										`${value} are now active for all admins.`,
								},
							)
						}
					>
						Promise toast
					</Button>
					<Button
						usage="secondary"
						variant="flat"
						leadingIcon={
							<Icon
								icon={RotateCcw}
								className="h-4 w-4"
							/>
						}
						onClick={() =>
							toast.undo("User deleted", {
								description: "The account will be restored if you undo now.",
								onUndo: () =>
									toast.info("Delete reverted", {
										description: "The user was added back to the directory.",
									}),
							})
						}
					>
						Undo toast
					</Button>
					<Button
						usage="danger"
						variant="flat"
						leadingIcon={
							<Icon
								icon={AlertCircle}
								className="h-4 w-4"
							/>
						}
						onClick={() =>
							toast.danger("403 Forbidden", {
								description:
									"You do not have permission to delete this enrollment.",
							})
						}
					>
						API error
					</Button>
				</div>
			</ParticleSection>
		</ParticleContainer>
	);
}
