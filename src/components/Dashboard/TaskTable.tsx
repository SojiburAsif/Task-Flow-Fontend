"use client";

import React, { useEffect, useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, CircleDashed, Paperclip, Users2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateTaskStatusAction } from "@/services/task.actions";
import type { TaskRecord, TaskStatusValue } from "@/services/task.service";

const statusLabel: Record<TaskStatusValue, string> = {
	Todo: "To Do",
	InProgress: "In Progress",
	Completed: "Completed",
};

const normalizeStatus = (status?: string | null): TaskStatusValue => {
	if (status === "InProgress" || status === "Completed") return status;
	return "Todo";
};

const allowedStatuses = (status: TaskStatusValue): TaskStatusValue[] => {
	switch (status) {
		case "Todo":
			return ["Todo", "InProgress"];
		case "InProgress":
			return ["InProgress", "Completed"];
		default:
			return ["Completed"];
	}
};

const parseDateValue = (value?: string | null) => {
	if (!value) return null;

	const datePart = value.trim().slice(0, 10);
	if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
		const [year, month, day] = datePart.split("-").map(Number);
		return new Date(year, month - 1, day);
	}

	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) return null;
	return parsed;
};

const formatDate = (value?: string | null) => {
	const parsed = parseDateValue(value);
	if (!parsed) return "No deadline";
	return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const getRelativeDueLabel = (value?: string | null) => {
	const parsed = parseDateValue(value);
	if (!parsed) return "No deadline";

	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const due = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
	const diffDays = Math.round((due.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));

	if (diffDays === 0) return "Due today";
	if (diffDays > 0) return `${diffDays} day${diffDays === 1 ? "" : "s"} left`;

	const overdueBy = Math.abs(diffDays);
	return `${overdueBy} day${overdueBy === 1 ? "" : "s"} overdue`;
};

const isOverdue = (task: TaskRecord) => normalizeStatus(task.status) !== "Completed" && new Date(task.dueDate).getTime() < Date.now();

const getStatusStyles = (status: TaskStatusValue) => {
	switch (status) {
		case "Completed":
			return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300";
		case "InProgress":
			return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300";
		default:
			return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300";
	}
};

const getPriorityStyles = (priority?: string | null) => {
	switch ((priority || "Medium").toLowerCase()) {
		case "high":
			return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300";
		case "low":
			return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300";
		default:
			return "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300";
	}
};

const getFileName = (url: string) => {
	try {
		const pathname = new URL(url).pathname;
		const lastSegment = pathname.split("/").filter(Boolean).pop();
		return lastSegment ? decodeURIComponent(lastSegment) : url;
	} catch {
		return url;
	}
};

const getPriorityRank = (priority?: string | null) => {
	switch ((priority || "Medium").toLowerCase()) {
		case "high":
			return 0;
		case "medium":
			return 1;
		default:
			return 2;
	}
};

const buildTaskEditHref = (taskId: string, returnTo: string) => `/dashboard/tasks/${taskId}/edit?returnTo=${encodeURIComponent(returnTo)}`;

export type TaskTableProps = {
	tasks: TaskRecord[];
	returnTo: string;
	statusEditable?: boolean;
	allowAssignmentEdit?: boolean;
	allowTaskEdit?: boolean;
};

function TaskRow({
	task,
	returnTo,
	statusEditable,
	allowAssignmentEdit,
	allowTaskEdit,
	isExpanded,
	onToggleDetails,
}: {
	task: TaskRecord;
	returnTo: string;
	statusEditable: boolean;
	allowAssignmentEdit: boolean;
	allowTaskEdit: boolean;
	isExpanded: boolean;
	onToggleDetails: () => void;
}) {
	const currentStatus = normalizeStatus(task.status);
	const overdue = isOverdue(task);
	const attachments = task.attachments?.length ?? 0;
	const [updateState, updateAction, updatePending] = useActionState(updateTaskStatusAction, { success: false, message: "" });

	useEffect(() => {
		if (!updateState) return;
		if (updateState.success) {
			toast.success(updateState.message || "Task updated");
		} else if (updateState.message) {
			toast.error(updateState.message);
		}
	}, [updateState]);

	return (
		<>
			<tr className="border-b border-zinc-100 last:border-0 transition hover:bg-zinc-50/60 dark:border-zinc-800/80 dark:hover:bg-zinc-900/30">
				<td className="px-4 py-4 align-top">
					<div className="space-y-1">
						<button type="button" onClick={onToggleDetails} className="text-left font-bold text-zinc-950 transition hover:text-purple-600 dark:text-zinc-50 dark:hover:text-purple-300">
							{task.title}
						</button>
						<p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">ID: {task.id}</p>
						<p className="max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">{task.description || "No description provided for this task."}</p>
					</div>
				</td>
				<td className="px-4 py-4 align-top">
					<div className="space-y-1">
						<Link href={`/dashboard/projects?view=${task.project.id}`} className="font-semibold text-purple-600 transition hover:text-purple-500 dark:text-purple-300">
							{task.project.name}
						</Link>
						<p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Project ID: {task.project.id}</p>
					</div>
				</td>
				<td className="px-4 py-4 align-top text-sm text-zinc-600 dark:text-zinc-400">
					<div className="space-y-2">
						<div className="inline-flex items-center gap-2">
							<CalendarDays className="h-4 w-4 text-purple-500" />
							<span>{formatDate(task.dueDate)}</span>
						</div>
						<p className="text-xs text-zinc-500 dark:text-zinc-400">{getRelativeDueLabel(task.dueDate)}</p>
						<div className="inline-flex items-center gap-2">
							<Paperclip className="h-4 w-4 text-purple-500" />
							<span>{attachments} attachment{attachments === 1 ? "" : "s"}</span>
						</div>
						{overdue ? <Badge className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">Overdue</Badge> : null}
					</div>
				</td>
				<td className="px-4 py-4 align-top text-sm text-zinc-600 dark:text-zinc-400">
					{task.assignedTo ? (
						<div className="space-y-1">
							<div className="inline-flex items-center gap-2">
								<Users2 className="h-4 w-4 text-purple-500" />
								<span className="font-semibold text-zinc-900 dark:text-zinc-100">{task.assignedTo.name || "Unnamed user"}</span>
							</div>
							<p className="text-xs text-zinc-500 dark:text-zinc-400">{task.assignedTo.id}</p>
						</div>
					) : (
						<span className="text-zinc-500 dark:text-zinc-400">Unassigned</span>
					)}
				</td>
				<td className="px-4 py-4 align-top">
					{statusEditable ? (
						<form action={updateAction} className="space-y-3">
							<input type="hidden" name="id" value={task.id} />
							<input type="hidden" name="returnTo" value={returnTo} />
							<div className="space-y-2">
								<select name="status" defaultValue={currentStatus} className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-zinc-800 dark:bg-zinc-950">
									{allowedStatuses(currentStatus).map(item => (
										<option key={item} value={item}>{statusLabel[item]}</option>
									))}
								</select>
								{allowAssignmentEdit ? (
									<div>
										<label className="mb-1 block text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Assign to</label>
										{task.project?.members && task.project.members.length > 0 ? (
											<select name="assignedToId" defaultValue={task.assignedTo?.id ?? ""} className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-950">
												<option value="">Unassigned</option>
												{task.project.members.map(member => (
													<option key={member.id} value={member.id}>{member.name || member.id}</option>
												))}
											</select>
										) : (
											<select disabled className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40">
												<option value="">No members in project</option>
											</select>
										)}
									</div>
								) : null}
							</div>
							<Button type="submit" className="h-10 w-full rounded-xl bg-purple-600 font-bold text-white hover:bg-purple-700" disabled={updatePending}>
								{updatePending ? "Saving..." : "Save"}
							</Button>
						</form>
					) : (
						<Badge className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] ${getStatusStyles(currentStatus)}`}>
							{statusLabel[currentStatus]}
						</Badge>
					)}
				</td>
				<td className="px-4 py-4 align-top">
					<Badge className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] ${getPriorityStyles(task.priority)}`}>
						{(task.priority || "Medium")} Priority
					</Badge>
				</td>
				<td className="px-4 py-4 align-top">
					<div className="flex flex-wrap gap-2">
						<button type="button" onClick={onToggleDetails} className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:border-purple-300 hover:text-purple-600 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-purple-500/60 dark:hover:text-purple-300">
							{isExpanded ? "Hide details" : "View details"} <CircleDashed className="h-4 w-4" />
						</button>
						<Link href={`/dashboard/projects?view=${task.project.id}`} className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:border-purple-300 hover:text-purple-600 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-purple-500/60 dark:hover:text-purple-300">
							Project <ArrowUpRight className="h-4 w-4" />
						</Link>
						{allowTaskEdit ? (
							<Link href={buildTaskEditHref(task.id, returnTo)} className="inline-flex items-center gap-1 rounded-xl bg-purple-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-purple-700">
								Edit task
							</Link>
						) : null}
					</div>
				</td>
			</tr>
			{isExpanded ? (
				<tr className="border-b border-zinc-100 bg-zinc-50/60 dark:border-zinc-800/80 dark:bg-zinc-900/25">
					<td colSpan={7} className="px-4 py-4">
						<div className="grid gap-4 lg:grid-cols-2">
							<div className="rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950/70">
								<p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Description</p>
								<p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">{task.description || "No description provided for this task."}</p>
							</div>
							<div className="rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950/70">
								<div className="mb-2 flex items-center justify-between gap-3">
									<p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Attachments</p>
									<p className="text-xs text-zinc-500 dark:text-zinc-400">{attachments} file{attachments === 1 ? "" : "s"}</p>
								</div>
								{task.attachments && task.attachments.length > 0 ? (
									<div className="space-y-2">
										{task.attachments.map(url => (
											<div key={url} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950">
												<span className="max-w-88 truncate text-sm text-zinc-700 dark:text-zinc-300">{getFileName(url)}</span>
												<div className="flex items-center gap-2">
													<a href={url} target="_blank" rel="noreferrer" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:border-purple-300 hover:text-purple-600 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-purple-500/60 dark:hover:text-purple-300">Open</a>
													<a href={url} download={getFileName(url)} className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-purple-700">Download</a>
												</div>
											</div>
										))}
									</div>
								) : (
									<div className="rounded-xl border border-dashed border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
										No attachments available for this task.
									</div>
								)}
							</div>
						</div>
					</td>
				</tr>
			) : null}
		</>
	);
}

export function TaskTable({ tasks, returnTo, statusEditable = false, allowAssignmentEdit = false, allowTaskEdit = false }: TaskTableProps) {
	const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

	const sortedTasks = useMemo(() => {
		return [...tasks].sort((a, b) => {
			const priorityDiff = getPriorityRank(a.priority) - getPriorityRank(b.priority);
			if (priorityDiff !== 0) return priorityDiff;

			const dueA = parseDateValue(a.dueDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
			const dueB = parseDateValue(b.dueDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
			if (dueA !== dueB) return dueA - dueB;

			const createdA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
			const createdB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
			return createdB - createdA;
		});
	}, [tasks]);

	const toggleDetails = (taskId: string) => {
		setExpandedTaskId(current => (current === taskId ? null : taskId));
	};

	if (tasks.length === 0) {
		return (
			<div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-zinc-50/40 p-10 text-center dark:border-zinc-800 dark:bg-zinc-950/20">
				<div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
					<CircleDashed size={26} className="text-zinc-400 dark:text-zinc-500" />
				</div>
				<h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No tasks available</h3>
				<p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
					When tasks are assigned here, they will appear with deadline, status, priority, assignee, and project context.
				</p>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto rounded-3xl border border-zinc-200/80 bg-white/90 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/90">
			<table className="min-w-full divide-y divide-zinc-200 text-left dark:divide-zinc-800">
				<thead className="sticky top-0 z-10 bg-zinc-50/90 backdrop-blur dark:bg-zinc-900/70">
					<tr className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
						<th className="px-4 py-4">Task</th>
						<th className="px-4 py-4">Project</th>
						<th className="px-4 py-4">Deadline</th>
						<th className="px-4 py-4">Assignee</th>
						<th className="px-4 py-4">Status</th>
						<th className="px-4 py-4">Priority</th>
						<th className="px-4 py-4">Actions</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950/50">
					{sortedTasks.map(task => (
						<TaskRow
							key={task.id}
							task={task}
							returnTo={returnTo}
							statusEditable={statusEditable}
							allowAssignmentEdit={allowAssignmentEdit}
							allowTaskEdit={allowTaskEdit}
							isExpanded={expandedTaskId === task.id}
							onToggleDetails={() => toggleDetails(task.id)}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
}
