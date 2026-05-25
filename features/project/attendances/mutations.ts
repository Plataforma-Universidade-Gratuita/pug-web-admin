"use client";

import {
	useMutation,
	useQueryClient,
	type QueryClient,
} from "@tanstack/react-query";

import { create, remove, validate } from "@/api/web/project/attendances";
import { attendanceQueryKeys } from "@/features/project/attendances/queries";
import type { AttendanceResponse } from "@/types";
import type {
	AttendanceCreateMutationVariables,
	AttendanceRemoveMutationVariables,
	AttendanceValidateMutationVariables,
} from "@/types";

function upsertListItem<TItem>(
	items: TItem[] | undefined,
	nextItem: TItem,
	getId: (item: TItem) => string,
) {
	if (!items) {
		return [nextItem];
	}

	const nextId = getId(nextItem);
	const existingIndex = items.findIndex(item => getId(item) === nextId);

	if (existingIndex === -1) {
		return [nextItem, ...items];
	}

	return items.map((item, index) =>
		index === existingIndex ? nextItem : item,
	);
}

function removeListItem<TItem>(
	items: TItem[] | undefined,
	id: string,
	getId: (item: TItem) => string,
) {
	return items?.filter(item => getId(item) !== id) ?? items;
}

function writeAttendanceCaches(
	queryClient: QueryClient,
	attendance: AttendanceResponse,
) {
	queryClient.setQueryData(
		attendanceQueryKeys.detail(attendance.id),
		attendance,
	);
	queryClient.setQueryData<AttendanceResponse[]>(
		attendanceQueryKeys.list(),
		current => upsertListItem(current, attendance, item => item.id),
	);
}

function removeAttendanceCaches(
	queryClient: QueryClient,
	attendanceId: string,
) {
	queryClient.setQueryData<AttendanceResponse[]>(
		attendanceQueryKeys.list(),
		current => removeListItem(current, attendanceId, item => item.id),
	);
	queryClient.removeQueries({
		queryKey: attendanceQueryKeys.detail(attendanceId),
	});
}

export function useCreateAttendanceMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ body }: AttendanceCreateMutationVariables) => create(body),
		onSuccess: attendance => {
			writeAttendanceCaches(queryClient, attendance);
		},
	});
}

export function useValidateAttendanceMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ body, id }: AttendanceValidateMutationVariables) =>
			validate(id, body),
		onSuccess: attendance => {
			writeAttendanceCaches(queryClient, attendance);
		},
	});
}

export function useRemoveAttendanceMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id }: AttendanceRemoveMutationVariables) => remove(id),
		onSuccess: (_data, variables) => {
			removeAttendanceCaches(queryClient, variables.id);
		},
	});
}
