"use client";

import { useTranslation } from "react-i18next";

export default function Page() {
	const shades = [
		50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
	] as const;
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
										className={`br-squircle ty-sm-semibold px-3 py-2 ${fg} border-default-1 border-1 bg-${c}-${s} hover:brightness-110`}
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
					<button className="br-squircle bg-brand hover:bg-brand-600 shadow-weak px-4 py-2 text-neutral-50">
						{t("Docs.CardExample.cta")}
					</button>
				</div>
			</section>
		</main>
	);
}
