"use client";

import {
	useMutation,
	useQueryClient,
	type QueryClient,
} from "@tanstack/react-query";

import {
	accept,
	cancel,
	complete,
	deleteEnrollment,
	reject,
	remove as markRemoved,
} from "@/api/web/project/enrollments";
import { enrollmentQueryKeys } from "@/features/project/enrollment/queries";
import type { EnrollmentResponse } from "@/types";
import type {
	EnrollmentDeleteMutationVariables,
	EnrollmentStatusMutationVariables,
} from "@/types";

function upsertListItem<TItem>(
	items: TItem[] | undefined,
	nextItem: TItem,
	matches: (item: TItem) => boolean,
) {
	if (!items) {
		return [nextItem];
	}

	const existingIndex = items.findIndex(matches);

	if (existingIndex === -1) {
		return [nextItem, ...items];
	}

	return items.map((item, index) =>
		index === existingIndex ? nextItem : item,
	);
}

function removeListItem<TItem>(
	items: TItem[] | undefined,
	matches: (item: TItem) => boolean,
) {
	return items?.filter(item => !matches(item)) ?? items;
}

function isSameEnrollment(
	item: Pick<EnrollmentResponse, "projectId" | "studentId">,
	projectId: string,
	studentId: string,
) {
	return item.projectId === projectId && item.studentId === studentId;
}

function writeEnrollmentCaches(
	queryClient: QueryClient,
	enrollment: EnrollmentResponse,
) {
	queryClient.setQueryData(
		enrollmentQueryKeys.detail(enrollment.projectId, enrollment.studentId),
		enrollment,
	);
	queryClient.setQueryData<EnrollmentResponse[]>(
		enrollmentQueryKeys.list(),
		current =>
			upsertListItem(current, enrollment, item =>
				isSameEnrollment(item, enrollment.projectId, enrollment.studentId),
			),
	);
}

function removeEnrollmentCaches(
	queryClient: QueryClient,
	projectId: string,
	studentId: string,
) {
	queryClient.setQueryData<EnrollmentResponse[]>(
		enrollmentQueryKeys.list(),
		current =>
			removeListItem(current, item =>
				isSameEnrollment(item, projectId, studentId),
			),
	);
	queryClient.removeQueries({
		queryKey: enrollmentQueryKeys.detail(projectId, studentId),
	});
}

async function runEnrollmentStatusAction({
	action,
	projectId,
	studentId,
}: EnrollmentStatusMutationVariables) {
	switch (action) {
		case "accept":
			return accept(projectId, studentId);
		case "cancel":
			return cancel(projectId, studentId);
		case "complete":
			return complete(projectId, studentId);
		case "reject":
			return reject(projectId, studentId);
		case "remove":
		default:
			return markRemoved(projectId, studentId);
	}
}

export function useEnrollmentStatusMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: runEnrollmentStatusAction,
		onSuccess: enrollment => {
			writeEnrollmentCaches(queryClient, enrollment);
		},
	});
}

export function useDeleteEnrollmentMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ projectId, studentId }: EnrollmentDeleteMutationVariables) =>
			deleteEnrollment(projectId, studentId),
		onSuccess: (_data, variables) => {
			removeEnrollmentCaches(
				queryClient,
				variables.projectId,
				variables.studentId,
			);
		},
	});
}
