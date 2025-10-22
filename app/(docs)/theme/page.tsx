"use client";

import { useTranslation } from "react-i18next";

export default function Page() {
	const shades = [
		50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
	] as const;
	const bg = {
		brand: {
			50: "bg-brand-50",
			100: "bg-brand-100",
			200: "bg-brand-200",
			300: "bg-brand-300",
			400: "bg-brand-400",
			500: "bg-brand-500",
			600: "bg-brand-600",
			700: "bg-brand-700",
			800: "bg-brand-800",
			900: "bg-brand-900",
			950: "bg-brand-950",
		},
		success: {
			50: "bg-success-50",
			100: "bg-success-100",
			200: "bg-success-200",
			300: "bg-success-300",
			400: "bg-success-400",
			500: "bg-success-500",
			600: "bg-success-600",
			700: "bg-success-700",
			800: "bg-success-800",
			900: "bg-success-900",
			950: "bg-success-950",
		},
		info: {
			50: "bg-info-50",
			100: "bg-info-100",
			200: "bg-info-200",
			300: "bg-info-300",
			400: "bg-info-400",
			500: "bg-info-500",
			600: "bg-info-600",
			700: "bg-info-700",
			800: "bg-info-800",
			900: "bg-info-900",
			950: "bg-info-950",
		},
		danger: {
			50: "bg-danger-50",
			100: "bg-danger-100",
			200: "bg-danger-200",
			300: "bg-danger-300",
			400: "bg-danger-400",
			500: "bg-danger-500",
			600: "bg-danger-600",
			700: "bg-danger-700",
			800: "bg-danger-800",
			900: "bg-danger-900",
			950: "bg-danger-950",
		},
		warning: {
			50: "bg-warning-50",
			100: "bg-warning-100",
			200: "bg-warning-200",
			300: "bg-warning-300",
			400: "bg-warning-400",
			500: "bg-warning-500",
			600: "bg-warning-600",
			700: "bg-warning-700",
			800: "bg-warning-800",
			900: "bg-warning-900",
			950: "bg-warning-950",
		},
		base: {
			50: "bg-base-50",
			100: "bg-base-100",
			200: "bg-base-200",
			300: "bg-base-300",
			400: "bg-base-400",
			500: "bg-base-500",
			600: "bg-base-600",
			700: "bg-base-700",
			800: "bg-base-800",
			900: "bg-base-900",
			950: "bg-base-950",
		},
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
