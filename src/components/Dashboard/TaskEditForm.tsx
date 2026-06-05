"use client";

import React, { useActionState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updateTaskAction } from "@/services/task.actions";
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

const allStatuses: TaskStatusValue[] = ["Todo", "InProgress", "Completed"];

const formatDateInput = (value?: string | null) => {
	if (!value) return "";
	const datePart = value.trim().slice(0, 10);
	if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
		return datePart;
	}

	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) return "";

	const year = parsed.getFullYear();
	const month = String(parsed.getMonth() + 1).padStart(2, "0");
	const day = String(parsed.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

export type TaskEditFormProps = {
	task: TaskRecord;
	mode: "full" | "status";
	returnTo: string;
};

export function TaskEditForm({ task, mode, returnTo }: TaskEditFormProps) {
	const currentStatus = normalizeStatus(task.status);
	const [state, formAction, pending] = useActionState(updateTaskAction, { success: false, message: "" });

	useEffect(() => {
		if (!state) return;
		if (state.success) {
			toast.success(state.message || "Task updated");
		} else if (state.message) {
			toast.error(state.message);
		}
	}, [state]);

	const canEditEverything = mode === "full";
	const statuses = canEditEverything ? allStatuses : allowedStatuses(currentStatus);

	return (
		<Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800">
			<CardHeader className="border-b border-zinc-100 dark:border-zinc-800">
				<CardTitle className="flex items-center gap-3 text-xl text-zinc-950 dark:text-zinc-50">
					<span>Task editor</span>
					<Badge className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-purple-700 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-300">
						{task.id}
					</Badge>
				</CardTitle>
				<CardDescription className="text-zinc-600 dark:text-zinc-400">
					{canEditEverything
						? "Update the task details, assignment, deadline, and status."
						: "You can only update the task status from this view."}
				</CardDescription>
			</CardHeader>
			<CardContent className="p-4 sm:p-6">
				<form action={formAction} className="space-y-5">
					<input type="hidden" name="id" value={task.id} />
					<input type="hidden" name="returnTo" value={returnTo} />

					{canEditEverything ? (
						<div className="grid gap-4">
							<div className="grid gap-4 lg:grid-cols-2">
								<div className="space-y-2">
									<label className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Title</label>
									<input
										name="title"
										defaultValue={task.title}
										className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-950 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
										required
									/>
								</div>
								<div className="space-y-2">
									<label className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Deadline</label>
									<input
										name="dueDate"
										type="date"
										defaultValue={formatDateInput(task.dueDate)}
										className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
										required
									/>
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Description</label>
								<textarea
									name="description"
									defaultValue={task.description ?? ""}
									rows={4}
									className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-950 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
								/>
							</div>

							<div className="grid gap-4 lg:grid-cols-3">
								<div className="space-y-2">
									<label className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Priority</label>
									<select name="priority" defaultValue={task.priority ?? "Medium"} className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
										<option value="High">High</option>
										<option value="Medium">Medium</option>
										<option value="Low">Low</option>
									</select>
								</div>
								<div className="space-y-2">
									<label className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Status</label>
									<select name="status" defaultValue={currentStatus} className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
										{statuses.map(item => (
											<option key={item} value={item}>{statusLabel[item]}</option>
										))}
									</select>
								</div>
								<div className="space-y-2">
									<label className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Assign to</label>
									{task.project.members && task.project.members.length > 0 ? (
										<select name="assignedToId" defaultValue={task.assignedTo?.id ?? ""} className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
											<option value="">Unassigned</option>
											{task.project.members.map(member => (
												<option key={member.id} value={member.id}>{member.name || member.id}</option>
											))}
										</select>
									) : (
										<select disabled className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40">
											<option value="">No members in project</option>
										</select>
									)}
								</div>
							</div>
						</div>
					) : (
						<div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="space-y-2 sm:col-span-2">
									<label className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Status</label>
									<select name="status" defaultValue={currentStatus} className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
										{statuses.map(item => (
											<option key={item} value={item}>{statusLabel[item]}</option>
										))}
									</select>
								</div>
								<div className="space-y-2 sm:col-span-2">
									<label className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Current status</label>
									<p className="rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
										{statusLabel[currentStatus]}
									</p>
								</div>
							</div>
						</div>
					)}

					<div className="flex flex-wrap items-center gap-3">
						<Button type="submit" className="rounded-xl bg-purple-600 px-5 font-bold text-white hover:bg-purple-700" disabled={pending}>
							{pending ? "Saving..." : canEditEverything ? "Save changes" : "Update status"}
						</Button>
						<Link href={returnTo} className="rounded-xl border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-purple-300 hover:text-purple-600 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-purple-500/60 dark:hover:text-purple-300">
							Back
						</Link>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
