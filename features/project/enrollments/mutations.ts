"use client";

import {
	useMutation,
	useQueryClient,
	type QueryClient,
} from "@tanstack/react-query";

import {
	deleteEnrollment,
	updateStatus,
} from "@/api/web/project/enrollments";
import { enrollmentQueryKeys } from "@/features/project/enrollments/queries";
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
	item: Pick<EnrollmentResponse, "projectId" | "formerStudentId">,
	projectId: string,
	formerStudentId: string,
) {
	return (
		item.projectId === projectId &&
		item.formerStudentId === formerStudentId
	);
}

function writeEnrollmentCaches(
	queryClient: QueryClient,
	enrollment: EnrollmentResponse,
) {
	queryClient.setQueryData(
		enrollmentQueryKeys.detail(
			enrollment.projectId,
			enrollment.formerStudentId,
		),
		enrollment,
	);
	queryClient.setQueryData<EnrollmentResponse[]>(
		enrollmentQueryKeys.list(),
		current =>
			upsertListItem(current, enrollment, item =>
				isSameEnrollment(
					item,
					enrollment.projectId,
					enrollment.formerStudentId,
				),
			),
	);
}

function removeEnrollmentCaches(
	queryClient: QueryClient,
	projectId: string,
	formerStudentId: string,
) {
	queryClient.setQueryData<EnrollmentResponse[]>(
		enrollmentQueryKeys.list(),
		current =>
			removeListItem(current, item =>
				isSameEnrollment(item, projectId, formerStudentId),
			),
	);
	queryClient.removeQueries({
		queryKey: enrollmentQueryKeys.detail(projectId, formerStudentId),
	});
}

function resolveNextStatus(action: EnrollmentStatusMutationVariables["action"]) {
	switch (action) {
		case "accept":
			return "APPROVED" as const;
		case "cancel":
			return "CANCELED" as const;
		case "complete":
			return "COMPLETED" as const;
		case "reject":
			return "REJECTED" as const;
		case "remove":
		default:
			return "REMOVED" as const;
	}
}

async function runEnrollmentStatusAction({
	action,
	projectId,
	formerStudentId,
}: EnrollmentStatusMutationVariables) {
	return updateStatus(
		projectId,
		formerStudentId,
		resolveNextStatus(action),
	);
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
		mutationFn: ({
			projectId,
			formerStudentId,
		}: EnrollmentDeleteMutationVariables) =>
			deleteEnrollment(projectId, formerStudentId),
		onSuccess: (_data, variables) => {
			removeEnrollmentCaches(
				queryClient,
				variables.projectId,
				variables.formerStudentId,
			);
		},
	});
}
