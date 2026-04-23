"use client";

import { CheckCircle2, CircleAlert, Info, TriangleAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Page() {
	const shades = [
		50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
	] as const;
	const spacing = [
		{ token: "--twc-space-1", label: "space-1", value: "4px" },
		{ token: "--twc-space-2", label: "space-2", value: "8px" },
		{ token: "--twc-space-3", label: "space-3", value: "12px" },
		{ token: "--twc-space-4", label: "space-4", value: "16px" },
		{ token: "--twc-space-5", label: "space-5", value: "24px" },
		{ token: "--twc-space-6", label: "space-6", value: "32px" },
		{ token: "--twc-space-7", label: "space-7", value: "48px" },
	] as const;
	const colorVarPrefix = {
		brand: "--color-brand",
		success: "--color-success",
		info: "--color-info",
		danger: "--color-danger",
		warning: "--color-warning",
		base: "--color-base",
	} as const;
	const textClass = {
		brand: "text-brand",
		success: "text-success",
		info: "text-info",
		danger: "text-danger",
		warning: "text-warning",
		base: "text-base",
	} as const;
	const { t } = useTranslation();

	return (
		<main className="mx-auto max-w-6xl space-y-8 p-6">
			<section className="space-y-3">
				<h2 className="ty-title">{t("Docs.Background.title")}</h2>
				<h4 className="ty-helper">{t("Docs.Background.description")}</h4>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<div className="surface-1 br-squircle shadow-weak border-default-1 border p-4">
						<p className="ty-caption">surface-1</p>
						<p className="ty-helper">{t("Docs.Background.surface-1")}</p>
					</div>
					<div className="surface-2 br-squircle shadow-normal border-default-2 border p-4">
						<p className="ty-caption">surface-2</p>
						<p className="ty-helper">{t("Docs.Background.surface-2")}</p>
					</div>
					<div className="surface-3 br-squircle shadow-strong border-default-3 border p-4">
						<p className="ty-caption">surface-3</p>
						<p className="ty-helper">{t("Docs.Background.surface-3")}</p>
					</div>
				</div>
			</section>

			<section className="surface-2 br-squircle shadow-normal border-default-2 space-y-2 border p-6">
				<h2 className="ty-title">{t("Docs.Typography.title")}</h2>
				<h4 className="ty-helper">{t("Docs.Typography.description")}</h4>
				<p className="ty-body">{t("Docs.Typography.ty-body")}</p>
				<p className="ty-body-semibold">
					{t("Docs.Typography.ty-body-semibold")}
				</p>
				<p className="ty-body-bold">{t("Docs.Typography.ty-body-bold")}</p>
				<p className="ty-sm">{t("Docs.Typography.ty-sm")}</p>
				<p className="ty-sm-semibold">{t("Docs.Typography.ty-sm-semibold")}</p>
				<p className="ty-sm-bold">{t("Docs.Typography.ty-sm-bold")}</p>
				<p className="ty-title">{t("Docs.Typography.ty-title")}</p>
				<p className="ty-title-alt">{t("Docs.Typography.ty-title-alt")}</p>
				<p className="ty-header">{t("Docs.Typography.ty-header")}</p>
				<p className="ty-helper">{t("Docs.Typography.ty-helper")}</p>
			</section>

			<section className="surface-2 br-squircle shadow-normal border-default-2 border p-6">
				<h2 className="ty-title">
					{t("Docs.Spacing.title", { defaultValue: "Spacing Scale" })}
				</h2>
				<h4 className="ty-helper">
					{t("Docs.Spacing.description", {
						defaultValue:
							"Use the spacing tokens to keep vertical rhythm, card padding, and control density consistent across screens.",
					})}
				</h4>
				<div className="mt-4 grid gap-3">
					{spacing.map(item => (
						<div
							key={item.token}
							className="surface-3 br-squircle border-default-2 flex items-center gap-4 border p-4"
						>
							<div className="min-w-28">
								<p className="ty-sm-semibold">{item.label}</p>
								<p className="ty-sm">{item.value}</p>
							</div>
							<div
								className="bg-brand-500 br-circle h-3"
								style={{ width: `var(${item.token})` }}
							/>
						</div>
					))}
				</div>
				<div className="mt-4 grid gap-4 md:grid-cols-3">
					<div className="surface-3 br-squircle border-default-2 pad-card border">
						<p className="ty-sm-semibold">
							{t("Docs.Spacing.card", { defaultValue: "Card padding" })}
						</p>
						<p className="ty-sm">
							{t("Docs.Spacing.cardDescription", {
								defaultValue:
									"Default large container padding should use space-5.",
							})}
						</p>
					</div>
					<div className="surface-3 br-squircle border-default-2 border p-4">
						<div className="gap-stack-2 flex flex-col">
							<p className="ty-sm-semibold">
								{t("Docs.Spacing.stackTight", {
									defaultValue: "Tight stack",
								})}
							</p>
							<p className="ty-sm">{t("Docs.Typography.ty-sm")}</p>
							<p className="ty-sm">{t("Docs.Typography.ty-sm-semibold")}</p>
						</div>
					</div>
					<div className="surface-3 br-squircle border-default-2 border p-4">
						<div className="gap-stack-3 flex flex-col">
							<p className="ty-sm-semibold">
								{t("Docs.Spacing.stackComfortable", {
									defaultValue: "Comfortable stack",
								})}
							</p>
							<p className="ty-sm">
								{t("Docs.Spacing.stackComfortableBody", {
									defaultValue:
										"Use larger gaps between separate content groups or sections.",
								})}
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="surface-2 br-squircle shadow-normal border-default-2 border p-6">
				<h2 className="ty-title">{t("Docs.Colors.title")}</h2>
				<h4 className="ty-helper">{t("Docs.Colors.description")}</h4>
				{(
					["brand", "success", "info", "danger", "warning", "base"] as const
				).map(c => (
					<div
						key={c}
						className="mt-5"
					>
						<h3 className={`${textClass[c]} capitalize`}>
							{t(`Docs.Colors.${c}`)}
						</h3>
						<div className="mt-2 grid grid-cols-11 gap-2">
							{shades.map(s => {
								const fg = s >= 500 ? "text-base-50" : "text-base-900";
								return (
									<button
										key={`${c}-${s}`}
										className={`br-squircle ty-sm-semibold border-default-1 border-1 px-3 py-2 hover:brightness-110 ${fg}`}
										style={{
											backgroundColor: `var(${colorVarPrefix[c]}-${s})`,
										}}
										title={`${c}-${s}`}
									>
										{s}
									</button>
								);
							})}
						</div>
					</div>
				))}
			</section>

			<section className="surface-2 br-squircle shadow-normal border-default-2 border p-6">
				<h2 className="ty-title">
					{t("Docs.Semantics.title", { defaultValue: "Usage Rules" })}
				</h2>
				<h4 className="ty-helper">
					{t("Docs.Semantics.description", {
						defaultValue:
							"These semantic rules keep screens consistent even when different components are built by different people.",
					})}
				</h4>
				<div className="mt-4 grid gap-4 md:grid-cols-2">
					<div className="surface-3 br-squircle border-default-2 border p-5">
						<p className="ty-sm-semibold">
							{t("Docs.Semantics.surfaces.title", {
								defaultValue: "Surface hierarchy",
							})}
						</p>
						<ul className="mt-3 space-y-2">
							<li className="ty-sm">
								{t("Docs.Semantics.surfaces.page", {
									defaultValue: "Use surface-1 for page background zones.",
								})}
							</li>
							<li className="ty-sm">
								{t("Docs.Semantics.surfaces.card", {
									defaultValue: "Use surface-2 for primary cards and panels.",
								})}
							</li>
							<li className="ty-sm">
								{t("Docs.Semantics.surfaces.inset", {
									defaultValue:
										"Use surface-3 for nested cards, filters, and embedded groups.",
								})}
							</li>
						</ul>
					</div>
					<div className="surface-3 br-squircle border-default-2 border p-5">
						<p className="ty-sm-semibold">
							{t("Docs.Semantics.feedback.title", {
								defaultValue: "Feedback colors",
							})}
						</p>
						<ul className="mt-3 space-y-2">
							<li className="ty-sm">
								{t("Docs.Semantics.feedback.brand", {
									defaultValue:
										"Brand is for primary actions and selected states.",
								})}
							</li>
							<li className="ty-sm">
								{t("Docs.Semantics.feedback.success", {
									defaultValue: "Success confirms completed or healthy states.",
								})}
							</li>
							<li className="ty-sm">
								{t("Docs.Semantics.feedback.warning", {
									defaultValue: "Warning signals caution, but not failure.",
								})}
							</li>
							<li className="ty-sm">
								{t("Docs.Semantics.feedback.danger", {
									defaultValue:
										"Danger is reserved for destructive actions and errors.",
								})}
							</li>
						</ul>
					</div>
				</div>
			</section>

			<section className="space-y-3">
				<h2 className="ty-title">{t("Docs.Radii.title")}</h2>
				<h4 className="ty-helper">{t("Docs.Radii.description")}</h4>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<div className="surface-2 br-square border-default-2 border p-6">
						<p className="ty-caption">{t("Docs.Radii.square")}</p>
					</div>
					<div className="surface-2 br-squircle border-default-2 border p-6">
						<p className="ty-caption">{t("Docs.Radii.squircle")}</p>
					</div>
					<div className="surface-2 br-circle border-default-2 border p-6">
						<p className="ty-caption">{t("Docs.Radii.circle")}</p>
					</div>
				</div>
			</section>

			<section className="surface-2 br-squircle shadow-normal border-default-2 border p-6">
				<h2 className="ty-title">
					{t("Docs.States.title", { defaultValue: "Interactive States" })}
				</h2>
				<h4 className="ty-helper">
					{t("Docs.States.description", {
						defaultValue:
							"Inputs and actions need consistent hover, focus, selected, disabled, and error behavior. These examples should drive component implementation.",
					})}
				</h4>
				<div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
					<div className="surface-3 br-squircle border-default-2 border p-5">
						<div className="gap-stack-3 flex flex-col">
							<div className="flex flex-wrap gap-3">
								<button className="btn-primary focus-ring">
									{t("Docs.States.primaryAction", {
										defaultValue: "Primary Action",
									})}
								</button>
								<button className="btn-secondary focus-ring">
									{t("Docs.States.secondaryAction", {
										defaultValue: "Secondary Action",
									})}
								</button>
								<button className="btn-danger focus-ring">
									{t("Docs.States.destructiveAction", {
										defaultValue: "Destructive Action",
									})}
								</button>
							</div>
							<div className="grid gap-3">
								<label className="gap-stack-1 grid">
									<span className="ty-sm-semibold">
										{t("Docs.States.fieldDefault", {
											defaultValue: "Default field",
										})}
									</span>
									<input
										className="field-base focus-ring"
										placeholder={t("Docs.States.placeholder", {
											defaultValue: "Type something...",
										})}
									/>
								</label>
								<label className="gap-stack-1 grid">
									<span className="ty-sm-semibold text-danger">
										{t("Docs.States.fieldError", {
											defaultValue: "Error field",
										})}
									</span>
									<input
										aria-invalid="true"
										className="field-base focus-ring"
										defaultValue="invalid@example"
									/>
								</label>
								<label className="gap-stack-1 grid">
									<span className="ty-sm-semibold">
										{t("Docs.States.fieldDisabled", {
											defaultValue: "Disabled field",
										})}
									</span>
									<input
										disabled
										className="field-base"
										defaultValue="Read only state"
									/>
								</label>
							</div>
						</div>
					</div>
					<div className="surface-3 br-squircle border-default-2 border p-5">
						<p className="ty-sm-semibold">
							{t("Docs.States.feedbackPreview", {
								defaultValue: "Feedback previews",
							})}
						</p>
						<div className="mt-4 grid gap-3">
							<div className="br-squircle flex items-center gap-3 border border-[color:var(--color-success-200)] bg-[color:var(--color-success-50)] p-3 text-[color:var(--color-success-800)]">
								<CheckCircle2 className="h-4 w-4 shrink-0" />
								<span className="ty-sm">
									{t("Docs.States.successMessage", {
										defaultValue:
											"Saved successfully. This confirms a completed action.",
									})}
								</span>
							</div>
							<div className="br-squircle flex items-center gap-3 border border-[color:var(--color-info-200)] bg-[color:var(--color-info-50)] p-3 text-[color:var(--color-info-800)]">
								<Info className="h-4 w-4 shrink-0" />
								<span className="ty-sm">
									{t("Docs.States.infoMessage", {
										defaultValue:
											"Informational notices should not compete with errors.",
									})}
								</span>
							</div>
							<div className="br-squircle flex items-center gap-3 border border-[color:var(--color-warning-200)] bg-[color:var(--color-warning-50)] p-3 text-[color:var(--color-warning-800)]">
								<TriangleAlert className="h-4 w-4 shrink-0" />
								<span className="ty-sm">
									{t("Docs.States.warningMessage", {
										defaultValue:
											"Warnings indicate caution before a risky step.",
									})}
								</span>
							</div>
							<div className="br-squircle flex items-center gap-3 border border-[color:var(--color-danger-200)] bg-[color:var(--color-danger-50)] p-3 text-[color:var(--color-danger-800)]">
								<CircleAlert className="h-4 w-4 shrink-0" />
								<span className="ty-sm">
									{t("Docs.States.dangerMessage", {
										defaultValue:
											"Errors and destructive confirmations should use danger.",
									})}
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="space-y-3">
				<h2 className="ty-title">{t("Docs.Shadows.title")}</h2>
				<h4 className="ty-helper">{t("Docs.Shadows.description")}</h4>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<div className="surface-2 shadow-weak border-default-2 border p-6">
						<p className="ty-caption">{t("Docs.Shadows.weak")}</p>
					</div>
					<div className="surface-2 shadow-normal border-default-2 border p-6">
						<p className="ty-caption">{t("Docs.Shadows.normal")}</p>
					</div>
					<div className="surface-2 shadow-strong border-default-2 border p-6">
						<p className="ty-caption">{t("Docs.Shadows.strong")}</p>
					</div>
				</div>
			</section>

			<section className="surface-2 br-squircle shadow-strong border-default-2 space-y-3 border p-6">
				<h2 className="ty-title">{t("Docs.CardExample.title")}</h2>
				<p className="ty-body">{t("Docs.CardExample.description")}</p>
				<div className="surface-3 br-squircle border-default-1 border-1 p-4">
					<p className="ty-sm">{t("Docs.CardExample.inset-text")}</p>
				</div>
				<div className="flex w-full items-center justify-end">
					<button className="btn-primary focus-ring shadow-weak">
						{t("Docs.CardExample.cta")}
					</button>
				</div>
			</section>
		</main>
	);
}
