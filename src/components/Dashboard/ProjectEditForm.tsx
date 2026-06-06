"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { deleteProjectAction, updateProjectAction } from "@/services/project.actions";
import type { ProjectRecord } from "@/services/project.service";
import type { UserProfile } from "@/services/user.service";
import { CalendarDays, Users2 } from "lucide-react";
import ConfirmDialog from "@/components/ui/confirm-dialog";

const formatDateInput = (value?: string | null) => {
	if (!value) return "";
	return new Date(value).toISOString().slice(0, 10);
};

type ActionState = {
	success: boolean;
	message: string;
};

type ProjectEditFormProps = {
	project: ProjectRecord;
	teamMembers: UserProfile[];
	returnTo?: string;
	onClose?: () => void;
};

export default function ProjectEditForm({ project, teamMembers, returnTo = "/dashboard/projects", onClose }: ProjectEditFormProps) {
	const [updateState, updateAction, updatePending] = useActionState<ActionState, FormData>(updateProjectAction, { success: false, message: "" });
	const [deleteState, deleteAction, deletePending] = useActionState<ActionState, FormData>(deleteProjectAction, { success: false, message: "" });

	useEffect(() => {
		if (!updateState) return;
		if (updateState.success) {
			toast.success(updateState.message || "Project updated successfully.");
			window.setTimeout(() => {
				if (onClose) {
					onClose();
				} else {
					window.location.assign(returnTo);
				}
			}, 500);
		} else if (updateState.message) {
			toast.error(updateState.message);
		}
	}, [returnTo, updateState, onClose]);

	useEffect(() => {
		if (!deleteState) return;
		if (deleteState.success) {
			toast.success(deleteState.message || "Project deleted successfully.");
			window.setTimeout(() => {
				if (onClose) {
					onClose();
				} else {
					window.location.assign(returnTo);
				}
			}, 500);
		} else if (deleteState.message) {
			toast.error(deleteState.message);
		}
	}, [returnTo, deleteState, onClose]);

	const isBusy = updatePending || deletePending;

	const updateFormId = `project-update-form-${project.id}`;
	const updateFormRef = useRef<HTMLFormElement | null>(null);
	const deleteFormRef = useRef<HTMLFormElement | null>(null);
	const [updateConfirmOpen, setUpdateConfirmOpen] = useState(false);
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

	return (
		<div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
			<form id={updateFormId} action={updateAction}>
				<input type="hidden" name="id" value={project.id} />
				<input type="hidden" name="returnTo" value={returnTo} />

				<Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800">
				<CardHeader>
					<CardTitle className="text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">Edit project</CardTitle>
					<CardDescription>Update project details and member assignment in one place.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-5">
					<div className="space-y-2">
						<Label htmlFor="name">Project Name</Label>
						<Input id="name" name="name" defaultValue={project.name} required />
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea id="description" name="description" defaultValue={project.description} rows={8} required />
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="deadline">Deadline</Label>
							<div className="relative">
								<Input id="deadline" name="deadline" type="date" defaultValue={formatDateInput(project.deadline)} />
								<CalendarDays className="pointer-events-none absolute right-3 top-2.5 text-zinc-400" size={18} />
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="status">Status</Label>
							<select id="status" name="status" defaultValue={project.status ?? "Active"} className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950">
								<option value="Active">Active</option>
								<option value="Completed">Completed</option>
								<option value="OnHold">On Hold</option>
							</select>
						</div>
					</div>
				</CardContent>
				</Card>
			</form>

			<Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg"><Users2 size={18} className="text-purple-500" />Assign members</CardTitle>
					<CardDescription>Team members who should be attached to this project.</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="max-h-104 space-y-3 overflow-y-auto pr-2">
						{teamMembers.length > 0 ? teamMembers.map(user => {
							const isChecked = project.members?.some(member => member.id === user.id) ?? false;

							return (
								<label key={user.id} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-zinc-100 p-3 transition hover:border-purple-200 hover:bg-purple-50/50 dark:border-zinc-800 dark:hover:border-purple-500/40 dark:hover:bg-purple-500/5">
									<input type="checkbox" name={`member-${user.id}`} defaultChecked={isChecked} className="h-4 w-4 rounded border-zinc-300 text-purple-600 focus:ring-purple-500" />
									<div className="min-w-0 flex-1">
										<p className="truncate text-sm font-semibold text-zinc-950 dark:text-zinc-50">{user.name || "Unnamed User"}</p>
										<p className="truncate text-xs uppercase tracking-[0.2em] text-zinc-500">{user.role}</p>
									</div>
								</label>
							);
						}) : (
							<div className="rounded-2xl border border-dashed border-zinc-200 p-6 text-sm text-zinc-500 dark:border-zinc-800">No team members available.</div>
						)}
					</div>

					<div className="mt-6 space-y-3 border-t border-zinc-100 pt-6 dark:border-zinc-800/80">
								<Button type="button" onClick={() => setUpdateConfirmOpen(true)} className="h-11 w-full rounded-xl bg-purple-600 text-white hover:bg-purple-700" disabled={updatePending || deletePending}>
									{updatePending ? "Saving..." : "Save changes"}
								</Button>

						{onClose ? (
							<button type="button" onClick={onClose} className="block w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-center text-sm font-semibold text-zinc-700 transition hover:border-purple-300 hover:text-purple-600 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-purple-500/60 dark:hover:text-purple-300">
								Close
							</button>
						) : (
							<Link href={returnTo} className="block rounded-xl border border-zinc-200 px-4 py-2.5 text-center text-sm font-semibold text-zinc-700 transition hover:border-purple-300 hover:text-purple-600 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-purple-500/60 dark:hover:text-purple-300">
								Back
							</Link>
						)}
					</div>
				</CardContent>
			</Card>

			<Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800">
				<CardHeader>
					<CardTitle className="text-lg font-bold text-zinc-950 dark:text-zinc-50">Danger zone</CardTitle>
					<CardDescription>Permanently remove this project and all of its references.</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						ref={deleteFormRef}
						action={deleteAction}
						className="space-y-4"
					>
						<input type="hidden" name="id" value={project.id} />
						<input type="hidden" name="returnTo" value={returnTo} />
						<p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
							This action cannot be undone. The project will disappear from project and task views.
						</p>
						<button type="button" onClick={() => setDeleteConfirmOpen(true)} className="h-11 w-full rounded-xl bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50" disabled={updatePending || deletePending}>
							{deletePending ? "Deleting..." : "Delete project"}
						</button>
					</form>
				</CardContent>
			</Card>

			<ConfirmDialog
				open={updateConfirmOpen}
				title="Confirm project update"
				description="Do you want to save these changes to the project?"
				confirmLabel="Save changes"
				cancelLabel="Cancel"
				loading={updatePending}
				onClose={() => setUpdateConfirmOpen(false)}
				onConfirm={() => {
					setUpdateConfirmOpen(false);
					// submit update form programmatically
					const form = document.getElementById(updateFormId) as HTMLFormElement | null;
					if (form) form.requestSubmit();
				}}
			/>

			<ConfirmDialog
				open={deleteConfirmOpen}
				title="Confirm project delete"
				description="Delete this project and all its data. This cannot be undone."
				confirmLabel="Delete project"
				cancelLabel="Cancel"
				loading={deletePending}
				onClose={() => setDeleteConfirmOpen(false)}
				onConfirm={() => {
					setDeleteConfirmOpen(false);
					const f = deleteFormRef.current;
					if (f) f.requestSubmit();
				}}
			/>
		
	</div>
	);
}
