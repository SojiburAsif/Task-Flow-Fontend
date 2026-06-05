"use client";

import React, { useEffect, useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, CircleDashed, Paperclip, Users2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateTaskStatusAction } from "@/services/task.actions";
import type { TaskRecord, TaskStatusValue } from "@/services/task.service";
import { TaskEditForm } from "@/components/Dashboard/TaskEditForm";

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

// edit href helper removed — editing now uses inline modal

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
	onViewProject,
	onEditTask,
}: {
	task: TaskRecord;
	returnTo: string;
	statusEditable: boolean;
	allowAssignmentEdit: boolean;
	allowTaskEdit: boolean;
	isExpanded: boolean;
	onToggleDetails: () => void;
	onViewProject: () => void;
	onEditTask: (task: TaskRecord) => void;
}) {
	const currentStatus = normalizeStatus(task.status);
	const overdue = isOverdue(task);
	const attachments = task.attachments?.length ?? 0;
	const [updateState, updateAction, updatePending] = useActionState(updateTaskStatusAction, { success: false, message: "" });

	// countdown timer state
	const [remainingLabel, setRemainingLabel] = useState<string>(getRelativeDueLabel(task.dueDate));
	const [progressPercent, setProgressPercent] = useState<number>(0);

	useEffect(() => {
		let mounted = true;
		const due = parseDateValue(task.dueDate)?.getTime();
		const created = task.createdAt ? new Date(task.createdAt).getTime() : (due ? due - 24 * 60 * 60 * 1000 : Date.now());
		const update = () => {
			if (!mounted) return;
			setRemainingLabel(getRelativeDueLabel(task.dueDate));
			if (!due) return setProgressPercent(0);
			const total = Math.max(due - created, 1);
			const elapsed = Date.now() - created;
			const pct = Math.min(Math.max(elapsed / total, 0), 1);
			setProgressPercent(pct * 100);
		};
		update();
		const id = window.setInterval(update, 1000);
		return () => { mounted = false; window.clearInterval(id); };
	}, [task.dueDate, task.createdAt]);

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
						<p className="max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">{task.description || "No description provided for this task."}</p>
					</div>
				</td>
				<td className="px-4 py-4 align-top">
					<div className="space-y-1">
						<Link href={`/dashboard/projects?view=${task.project.id}`} className="font-semibold text-purple-600 transition hover:text-purple-500 dark:text-purple-300">
							{task.project.name}
						</Link>
					</div>
				</td>
				<td className="px-4 py-4 align-top text-sm text-zinc-600 dark:text-zinc-400">
					<div className="space-y-2">
						<div className="inline-flex items-center gap-2">
							<CalendarDays className="h-4 w-4 text-purple-500" />
							<span>{formatDate(task.dueDate)}</span>
						</div>
						<p className={`text-xs font-medium ${isOverdue(task) ? "text-rose-600 dark:text-rose-300" : "text-zinc-500 dark:text-zinc-400"}`}>{remainingLabel}</p>
						{/* progress bar representing time from created -> due (fills left->right). when overdue it turns red */}
						<div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800/40">
							<div className={`h-full ${isOverdue(task) ? "bg-rose-500" : "bg-purple-600"}`} style={{ width: `${progressPercent}%` }} />
						</div>
						<div className="inline-flex items-center gap-2">
							<Paperclip className="h-4 w-4 text-purple-500" />
							<span>{attachments} attachment{attachments === 1 ? "" : "s"}</span>
						</div>
						{overdue ? <Badge className="border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-[0.18em] text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">Overdue</Badge> : null}
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
								<select name="status" defaultValue={currentStatus} className="h-10 w-full border border-zinc-200 bg-white px-3 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-zinc-800 dark:bg-zinc-950">
									{allowedStatuses(currentStatus).map(item => (
										<option key={item} value={item}>{statusLabel[item]}</option>
									))}
								</select>
								{allowAssignmentEdit ? (
									<div>
										<label className="mb-1 block text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Assign to</label>
										{task.project?.members && task.project.members.length > 0 ? (
											<select name="assignedToId" defaultValue={task.assignedTo?.id ?? ""} className="h-10 w-full border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-950">
												<option value="">Unassigned</option>
												{task.project.members.map(member => (
													<option key={member.id} value={member.id}>{member.name || member.id}</option>
												))}
											</select>
										) : (
											<select disabled className="h-10 w-full border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40">
												<option value="">No members in project</option>
											</select>
										)}
									</div>
								) : null}
							</div>
							<Button type="submit" className="h-10 w-full bg-purple-600 font-bold text-white hover:bg-purple-700" disabled={updatePending}>
								{updatePending ? "Saving..." : "Save"}
							</Button>
						</form>
					) : (
						<Badge className={`px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] ${getStatusStyles(currentStatus)}`}>
							{statusLabel[currentStatus]}
						</Badge>
					)}
				</td>
				<td className="px-4 py-4 align-top">
					<Badge className={`px-2.5 py-1 text-[11px] font-semibold normal-case tracking-normal ${getPriorityStyles(task.priority)}`}>
						{(task.priority || "Medium")}
					</Badge>
				</td>
				<td className="px-4 py-4 align-top">
					<div className="flex flex-wrap gap-2">
						<button type="button" onClick={onToggleDetails} className="inline-flex items-center gap-1 border border-zinc-200/90 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-purple-500/60 dark:hover:bg-purple-500/10 dark:hover:text-purple-300">
							{isExpanded ? "Hide details" : "View details"} <CircleDashed className="h-4 w-4" />
						</button>
						<button type="button" onClick={onViewProject} className="inline-flex items-center gap-1 border border-zinc-200/90 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-purple-500/60 dark:hover:bg-purple-500/10 dark:hover:text-purple-300">
							Project <ArrowUpRight className="h-4 w-4" />
						</button>
						{allowTaskEdit ? (
							<button type="button" onClick={() => onEditTask(task)} className="inline-flex items-center gap-1 bg-purple-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-purple-700">
								Edit task
							</button>
						) : null}
					</div>
				</td>
			</tr>
			{isExpanded ? (
				<tr className="border-b border-zinc-100 bg-zinc-50/60 dark:border-zinc-800/80 dark:bg-zinc-900/25">
					<td colSpan={7} className="px-4 py-4">
						<div className="grid gap-4 lg:grid-cols-2">
							<div className="border border-zinc-200/80 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950/70">
								<p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Description</p>
								<p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">{task.description || "No description provided for this task."}</p>
							</div>
							<div className="border border-zinc-200/80 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950/70">
								<div className="mb-2 flex items-center justify-between gap-3">
									<p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Attachments</p>
									<p className="text-xs text-zinc-500 dark:text-zinc-400">{attachments} file{attachments === 1 ? "" : "s"}</p>
								</div>
								{task.attachments && task.attachments.length > 0 ? (
									<div className="space-y-2">
										{task.attachments.map(url => (
											<div key={url} className="flex flex-wrap items-center justify-between gap-2 border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950">
												<span className="max-w-88 truncate text-sm text-zinc-700 dark:text-zinc-300">{getFileName(url)}</span>
												<div className="flex items-center gap-2">
													<a href={url} target="_blank" rel="noreferrer" className="border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:border-purple-300 hover:text-purple-600 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-purple-500/60 dark:hover:text-purple-300">Open</a>
													<a href={url} download={getFileName(url)} className="bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-purple-700">Download</a>
												</div>
											</div>
										))}
									</div>
								) : (
										<div className="border border-dashed border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
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
	const [openProjectModal, setOpenProjectModal] = useState<TaskRecord["project"] | null>(null);
	// search and status filter removed — keep table client-side simple for now
	const [editTask, setEditTask] = useState<TaskRecord | null>(null);

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

	const filteredTasks = useMemo(() => sortedTasks, [sortedTasks]);

	const toggleDetails = (taskId: string) => {
		setExpandedTaskId(current => (current === taskId ? null : taskId));
	};

	const onEditTask = (task: TaskRecord) => {
		setEditTask(task);
	};

	if (tasks.length === 0) {
		return (
			<>
				<div className="flex min-h-80 flex-col items-center justify-center border border-dashed border-zinc-300 bg-zinc-50/40 p-10 text-center dark:border-zinc-800 dark:bg-zinc-950/20">
					<div className="mb-5 flex h-16 w-16 items-center justify-center bg-zinc-100 dark:bg-zinc-900">
						<CircleDashed size={26} className="text-zinc-400 dark:text-zinc-500" />
					</div>
					<h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No tasks available</h3>
					<p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
						When tasks are assigned here, they will appear with deadline, status, priority, assignee, and project context.
					</p>
				</div>

				{/* editTask modal will render below (shared for empty/non-empty states) */}
			</>
		);
	}

	return (
		<>
			<div className="overflow-hidden border border-zinc-200/80 bg-white shadow-[0_10px_40px_-24px_rgba(0,0,0,0.35)] dark:border-zinc-800 dark:bg-zinc-950">
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
						{filteredTasks.map(task => (
							<TaskRow
							key={task.id}
							task={task}
							returnTo={returnTo}
							statusEditable={statusEditable}
							allowAssignmentEdit={allowAssignmentEdit}
							allowTaskEdit={allowTaskEdit}
							isExpanded={expandedTaskId === task.id}
								onToggleDetails={() => toggleDetails(task.id)}
								onViewProject={() => setOpenProjectModal(task.project)}
								onEditTask={onEditTask}
						/>
						))}
				</tbody>
			</table>
			</div>

			{editTask ? (
				<AnimatePresence>
					<motion.div
						initial={{ y: 300, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 300, opacity: 0 }}
						className="fixed inset-x-0 bottom-0 z-50 flex items-end justify-center"
						key="task-edit-sheet"
					>
						<div className="absolute inset-0 bg-black/40" onClick={() => setEditTask(null)} />
						<div className="relative w-full max-w-3xl rounded-t-2xl bg-white p-4 shadow-2xl dark:bg-zinc-950">
							<div className="mx-auto max-w-3xl">
								<TaskEditForm task={editTask!} mode="full" returnTo={returnTo} />
								<div className="mt-4 flex justify-end">
									<button onClick={() => setEditTask(null)} className="px-4 py-2 text-sm">Close</button>
								</div>
							</div>
						</div>
					</motion.div>
				</AnimatePresence>
			) : null}

			{openProjectModal ? (
				<AnimatePresence>
					<motion.div
						initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 backdrop-blur-sm"
						onClick={() => setOpenProjectModal(null)}
					>
						<motion.div
							initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
							className="flex w-full max-w-3xl max-h-[90vh] flex-col overflow-hidden bg-white shadow-2xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950"
							onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
						>
							<div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/60 px-6 py-5 dark:border-zinc-900 dark:bg-zinc-900/20 md:px-8">
								<div className="space-y-1">
									<p className="text-[10px] font-black uppercase tracking-[0.28em] text-purple-600 dark:text-purple-400">Project Details</p>
									<h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">{openProjectModal.name}</h2>
									<p className="text-sm text-zinc-600 dark:text-zinc-400">Project information from the current task row.</p>
								</div>
								<button onClick={() => setOpenProjectModal(null)} className="bg-zinc-100 p-2 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white">
									<X size={20} />
								</button>
							</div>

							<div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
								<div className="grid gap-4 sm:grid-cols-3">
									<div className="border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
										<p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Status</p>
										<p className="mt-2 text-sm font-bold text-zinc-950 dark:text-white">{openProjectModal.status || "Active"}</p>
									</div>
									<div className="border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
										<p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Deadline</p>
										<p className="mt-2 text-sm font-bold text-zinc-950 dark:text-white">{formatDate(openProjectModal.deadline)}</p>
									</div>
									<div className="border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
										<p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Members</p>
										<p className="mt-2 text-sm font-bold text-zinc-950 dark:text-white">{openProjectModal.members?.length ?? 0}</p>
									</div>
								</div>

								<div className="border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950/80">
									<h3 className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Description</h3>
									<p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">{openProjectModal.description || "No project description available."}</p>
								</div>

								<div className="border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/20">
									<div className="mb-4 flex items-center justify-between">
										<h3 className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Team Members</h3>
										<span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{openProjectModal.members?.length ?? 0} total</span>
									</div>
									{openProjectModal.members && openProjectModal.members.length > 0 ? (
										<div className="grid gap-3 sm:grid-cols-2">
											{openProjectModal.members.map((member) => (
												<div key={member.id} className="flex items-center gap-3 border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
													<div className="flex h-10 w-10 items-center justify-center bg-purple-100 font-bold text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
														{(member.name || "U").charAt(0).toUpperCase()}
													</div>
													<div className="min-w-0">
														<p className="truncate text-sm font-bold text-zinc-950 dark:text-zinc-100">{member.name || "Unnamed User"}</p>
														<p className="truncate text-xs text-zinc-500 dark:text-zinc-400">ID: {member.id}</p>
													</div>
												</div>
											))}
										</div>
									) : (
										<div className="border border-dashed border-zinc-300 bg-white p-4 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
											No team members assigned to this project.
										</div>
									)}
								</div>
							</div>
						</motion.div>
					</motion.div>
				</AnimatePresence>
			) : null}
		</>
	);
}
