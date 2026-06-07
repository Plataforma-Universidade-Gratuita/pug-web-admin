"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { CircleAlert } from "lucide-react";
import {
	Controller,
	useWatch,
	type FieldValues,
	type Path,
} from "react-hook-form";

import {
	formatCpfValue,
	normalizeCpfFieldQuery,
} from "@/components/composite/form-fields/utils";
import { Combobox, Icon, Label } from "@/components/primitives";
import { normalizeDigits } from "@/schemas/client";
import type {
	ComboboxOption,
	CpfFormFieldExistingUser,
	CpfFormFieldProps,
} from "@/types/client";

function findExistingUserByCpf<
	TUser extends {
		cpf: string;
	},
>(users: TUser[], cpfValue: string) {
	const normalizedCpf = normalizeDigits(cpfValue.trim());

	if (normalizedCpf.length === 0) {
		return null;
	}

	return users.find(user => user.cpf === normalizedCpf) ?? null;
}

export function CpfFormField<
	TValues extends FieldValues & {
		cpf: string;
		name: string;
	},
>({
	form,
	existingUsers,
	id = "cpf",
	label,
	tooltipContent,
	placeholder = "Select an existing CPF or enter a new one",
	searchPlaceholder = "Search or create a CPF",
	emptyMessage = "No CPF found.",
	createOptionLabel,
	onExistingUserChange,
}: CpfFormFieldProps<TValues>) {
	const [createdUsers, setCreatedUsers] = useState<CpfFormFieldExistingUser[]>(
		[],
	);
	const watchedCpf = useWatch({
		control: form.control,
		name: "cpf" as Path<TValues>,
	}) as string | undefined;
	const availableUsers = useMemo(
		() => [...existingUsers, ...createdUsers],
		[createdUsers, existingUsers],
	);
	const matchedExistingUser = useMemo(
		() => findExistingUserByCpf(availableUsers, watchedCpf ?? ""),
		[availableUsers, watchedCpf],
	);
	const cpfOptions = useMemo(() => {
		const options: ComboboxOption[] = availableUsers.map(user => ({
			value: user.cpfFormatted,
			label: user.cpfFormatted,
			description: user.name,
			keywords: [user.cpf, user.name],
			searchText: `${user.cpfFormatted} ${user.name}`,
		}));
		const normalizedWatchedCpf = normalizeDigits(watchedCpf ?? "");

		if (
			normalizedWatchedCpf.length === 11 &&
			!availableUsers.some(user => user.cpf === normalizedWatchedCpf)
		) {
			const formattedCpf = formatCpfValue(normalizedWatchedCpf);

			options.unshift({
				value: formattedCpf,
				label: formattedCpf,
			});
		}

		return options;
	}, [availableUsers, watchedCpf]);
	const lastAutoFilledNameRef = useRef<string | null>(null);

	useEffect(() => {
		onExistingUserChange?.(matchedExistingUser);
	}, [matchedExistingUser, onExistingUserChange]);

	useEffect(() => {
		if (matchedExistingUser) {
			if (
				(form.getValues("name" as Path<TValues>) as string) !==
				matchedExistingUser.name
			) {
				form.setValue(
					"name" as Path<TValues>,
					matchedExistingUser.name as TValues[Path<TValues>],
					{
						shouldDirty: true,
						shouldValidate: true,
					},
				);
			}

			lastAutoFilledNameRef.current = matchedExistingUser.name;
			return;
		}

		if (
			lastAutoFilledNameRef.current &&
			(form.getValues("name" as Path<TValues>) as string) ===
				lastAutoFilledNameRef.current
		) {
			form.setValue("name" as Path<TValues>, "" as TValues[Path<TValues>], {
				shouldDirty: true,
				shouldValidate: true,
			});
		}

		lastAutoFilledNameRef.current = null;
	}, [form, matchedExistingUser]);

	return (
		<div className="grid gap-2">
			<div className="flex items-center gap-2">
				<Label htmlFor={id}>{label}</Label>
				{tooltipContent ? (
					<Icon
						icon={CircleAlert}
						className="text-[color:var(--twc-muted)]"
						tooltipContent={tooltipContent}
					/>
				) : null}
			</div>
			<Controller
				control={form.control}
				name={"cpf" as Path<TValues>}
				render={({ field }) => (
					<Combobox
						id={id}
						options={cpfOptions}
						value={field.value}
						onValueChange={field.onChange}
						onCreateValue={value => {
							const formattedValue = formatCpfValue(value);
							const normalizedCpf = normalizeDigits(formattedValue);

							setCreatedUsers(currentUsers => {
								if (currentUsers.some(user => user.cpf === normalizedCpf)) {
									return currentUsers;
								}

								return [
									...currentUsers,
									{
										cpf: normalizedCpf,
										cpfFormatted: formattedValue,
										name: "",
									},
								];
							});

							field.onChange(formattedValue);
							return formattedValue;
						}}
						creatable
						createLabel={value =>
							createOptionLabel
								? createOptionLabel(formatCpfValue(value))
								: formatCpfValue(value)
						}
						queryNormalizer={normalizeCpfFieldQuery}
						canCreateValue={value => {
							const trimmedValue = value.trimStart();

							if (!trimmedValue || !/\d/.test(trimmedValue.charAt(0))) {
								return false;
							}

							const digits = normalizeDigits(value);
							return (
								digits.length === 11 &&
								!availableUsers.some(user => user.cpf === digits)
							);
						}}
						placeholder={placeholder}
						searchPlaceholder={searchPlaceholder}
						emptyMessage={emptyMessage}
					/>
				)}
			/>
			{form.formState.errors.cpf ? (
				<p
					id={`${id}-error`}
					className="field-error"
				>
					{String(form.formState.errors.cpf.message ?? "")}
				</p>
			) : null}
		</div>
	);
}
